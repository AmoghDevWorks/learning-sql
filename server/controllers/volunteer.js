const express  = require('express')
const pool = require('../config/db')

const transporter = require('../config/nodemailer')
const redisClient = require('../config/redis')

const signUp = (req,res,next) => {
    const { name, email, password, location, contact } = req.body

    if( !name || !email || !password || !location || !contact ) return res.status(404).json({message:"Fill all the fields"})

    pool.query('INSERT INTO volunteer (name, email, password, location, contact) VALUES (?, ?, ?, ?, ?)',[name,email,password,location,contact],(err,results)=>{
        if(err){
            if(err.code === 'ER_DUP_ENTRY') return res.status(404).json({message:"Account already exists"})
            return res.status(500).json({message:"Internal Server Error",details:err})
        }
        return res.status(201).json({message:"Successfully signedUp",userId:results.insertId})
    })
}

const signIn = (req,res,next) => {
    const { email, password } = req.body

    if(!email || !password) return res.status(404).json({message:"Fill all the fields"})
    
    pool.query('SELECT * FROM volunteer WHERE email = ?',[email],(err,results)=>{
        if(err) return res.status(500).json({message:"Internal Server Error"})
        
        if(results.length === 0) return res.status(404).json({message:"Account doesn't exists"})

        const user = results[0]

        if(user.password !== password) return res.status(404).json({message:"Invalid Credentials"})

        return res.status(200).json({message:"SignedIn successfully",userId:user.id})
    })
}

const getOrderFromLocation = (req, res, next) => {
  const userId = req.query.userId;

  pool.query('SELECT * FROM volunteer WHERE id = ?',[userId],(err,results)=>{
    if(err)return res.status(500).json({message:"Internal Server Error",details:err})
    if(results.length === 0) return res.status(404).json({message:"Invalid User Id"})

    const location = results[0].location

    pool.query(`
    SELECT 
      orders.*, 
      consumer.name AS consumerName, 
      consumer.contact AS consumerPhone
    FROM orders 
    JOIN consumer ON orders.consumerId = consumer.id 
    WHERE consumer.location = ? AND deliveryAssigned = ?
  `, [location, -1], (err, orders) => {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error", details: err });
    }

    if (orders.length === 0) {
      return res.status(200).json([]); // No orders found
    }

    // Convert to promises for order item queries
    const enrichedOrders = orders.map(order => {
      return new Promise((resolve, reject) => {
        pool.query(`
          SELECT 
            order_items.quantity, 
            products.name AS productName,
            farmer.contact AS farmerContact
          FROM order_items 
          JOIN products ON order_items.product_id = products.id 
          JOIN farmer ON farmer.id = products.farmerId
          WHERE order_items.order_id = ?
        `, [order.id], (err, items) => {
          if (err) return reject(err);

          order.details = items; // Add details to order
          resolve(order);
        });
      });
    });

      // Wait for all nested queries to finish
      Promise.all(enrichedOrders)
        .then(enriched => res.status(200).json(enriched))
        .catch(error => res.status(500).json({ message: "Internal Server Error", details: error }));
    });
  })
};

const takeDelivery = (req,res,next) => {
  const { orderId,volunteerId } = req.body

  if (!orderId || !volunteerId) {
    return res.status(400).json({ message: "Missing orderId or volunteerId" });
  }

  pool.query('SELECT * FROM orders WHERE deliveryAssigned = ? AND delivered = ?',[volunteerId,false],(err,results)=>{
    if(err) return res.status(500).json({message:"Internal Server Error",details:err})


    if(results.length > 0) return res.status(403).json({message:"Complete your current delivery task"})

    pool.query('UPDATE orders SET deliveryAssigned = ? WHERE id = ? AND deliveryAssigned = -1',[volunteerId,orderId],(err,results)=>{
      if(err) return res.status(500).json({message:"Internal Server Error",details:err})

      if(results.affectedRows === 0) return res.status(404).json({message:"Failed to perform the operation"})

      return res.status(200).json({message:"Delivery confirmed"})
    })
  })
}

const deliveredProducts = (req, res, next) => {
  const volunteerId = req.query.userId;

  if (!volunteerId) return res.status(404).json({ message: "Volunteer Id not found" });

  pool.query(
    `SELECT 
      orders.*,
      consumer.name AS consumerName,
      consumer.contact AS consumerPhone,
      consumer.email AS consumerEmail
    FROM orders
    JOIN consumer ON consumer.id = orders.consumerId
    WHERE orders.deliveryAssigned = ?
    ORDER BY orders.orderDate ASC`,
    [volunteerId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Internal Server Error" });

      const enrichedOrders = results.map(order => {
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT 
              order_items.quantity,
              products.name AS productName,
              farmer.contact AS farmerContact
            FROM order_items
            JOIN products ON products.id = order_items.product_id
            JOIN farmer ON products.farmerId = farmer.id
            WHERE order_items.order_id = ?`,
            [order.id],
            (err, items) => {
              if (err) reject(err);

              // Add details
              order.details = items;

              // consumerName and consumerPhone already in order from parent query
              resolve(order);
            }
          );
        });
      });

      Promise.all(enrichedOrders)
        .then(enriched => res.status(200).json(enriched))
        .catch(error => res.status(500).json({ message: "Internal Server Error", details: error }));
    }
  );
};

// email format
function createOrderEmail(consumerName, id, otp, details) {
  // details = array of objects, e.g. [{ item: 'Apple', qty: 3 }, { item: 'Banana', qty: 2 }]
  
  const rows = details.map(d => `
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">${d.productName}</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${d.quantity}</td>
    </tr>
  `).join('');

  return `
    <p>Respected <b>${consumerName}</b>,</p>
    <p>Your OTP for order <b>#${id}</b> is <b>${otp}</b>.</p>
    <p>Order details:</p>
    <table style="border-collapse: collapse; width: 100%; max-width: 400px;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Quantity</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
    <p>Thank you for your order!</p>
  `;
}

const confirmDelivery = (req,res,next) => {
  const OTP = Math.floor(100000 + Math.random() * 900000).toString();

  const { id, consumerEmail, details, consumerName } = req.body

  if( !id || !consumerEmail || !details ) return res.status(404).json({message:"Unable to find the required fields"})

  redisClient.get(`order:${id}`)
  .then(isPresent => {
    if(isPresent) return res.status(404).json({message:"Recent OTP is still valid"})

    const htmlContent = createOrderEmail(consumerName, id, OTP, details)

    const mailOptions = {
      from:'FarmTracker',
      to: consumerEmail,
      subject: `OTP for order:${id}`,
      html: htmlContent
    }

    return transporter.sendMail(mailOptions)
    .then(()=>{
      return redisClient.set(`order:${id}`, OTP, 'EX', 300)
    })
    .then(()=>{
      return res.status(200).json({message:"OTP sent successfully"})
    })
    .catch((e)=>{
      return res.status(500).json({message:"Failed to send the OTP",details:e})
    })
  })
  .catch(e => {
    return res.status(500).json({message:"Internal Server Error",details:e})
  })
}

const confirmOTP = (req,res,next) => {
  const orderId = req.query.id
  const userOTP = req.body.userOtp

  if(!orderId) return res.status(404).json({message:"Unable to find the order ID"})
  if(!userOTP) return res.status(404).json({message:"Enter the OTP"})

  //1. fetch that order id from redis 2.check validity of otp 3.not valid then get out 4. if valid then mark that order.delivered = true 
  redisClient.get(`order:${orderId}`)
  .then(otp => {
    if(!otp) return res.status(404).json({message:`OTP for the orderId:${orderId} not found`})
    
    if(otp !== userOTP) return res.status(404).json({message:"Invalid OTP"})

    pool.query('UPDATE orders SET delivered = true WHERE id = ?',[orderId],(err,results)=>{
      if(err) return res.status(500).json({message:"Internal Server Error",details:err})

      if(results.affectedRows === 0) return res.status(500).json({message:"Failed to update the data"})

      redisClient.del(`order:${orderId}`)
      .then(()=>{
        return res.status(200).json({message:"Order Delivered Successfully"})
      })
      .catch((err)=>{
        return res.status(500).json({message:"Internal Server Error",details:err})
      })
    })
  })
  .catch(err => {
    return res.status(500).json({message:"Internal Server Error",details:err})
  })
}

module.exports = { signUp,signIn,getOrderFromLocation,takeDelivery,deliveredProducts,confirmDelivery,confirmOTP }