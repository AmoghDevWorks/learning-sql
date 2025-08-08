const express  = require('express')
const pool = require('../config/db')

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
            products.name AS productName 
          FROM order_items 
          JOIN products ON order_items.product_id = products.id 
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
        .then(results => res.status(200).json(results))
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
      consumer.contact AS consumerPhone
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
              products.name AS productName
            FROM order_items
            JOIN products ON products.id = order_items.product_id
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
        .then(results => res.status(200).json(results))
        .catch(error => res.status(500).json({ message: "Internal Server Error", details: error }));
    }
  );
};


module.exports = { signUp,signIn,getOrderFromLocation,takeDelivery,deliveredProducts }