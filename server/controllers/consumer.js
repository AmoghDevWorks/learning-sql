const express = require('express')
const pool = require('../config/db')

const signUp = (req,res,next) => {
    const { fullName,email,password,phoneNumber,location } = req.body

    if( !fullName || !email || !password || !phoneNumber ) return res.status(404).json({message:"Fill the fields"})

    pool.query('INSERT INTO consumer (name, email, password, location, contact) VALUES (?, ?, ?, ?, ?)',[fullName,email,password,location,phoneNumber],(err,results)=>{
        if(err){
            console.log(err)
            if(err.code === 'ER_DUP_ENTRY') return res.status(404).json({message:'Account already exists'})
            return res.status(500).json({message:"Internal Server Error"})
        }

        return res.status(200).json({message:"successfull signUp ",userId:results.insertId})
    })
}

const signIn = (req,res,next) =>{
    const { email,password } = req.body;

    if( !email || !password ) return res.status(404).json({message:"Fill all the fields"})

    pool.query('SELECT * FROM consumer WHERE email = ?',[email],(err,results)=>{
        if(err) return res.status(500).json({message:"Internal Server Error"})
        if(results.length === 0) return res.status(404).json({message:"Invalid Email, User Not found"})

        const user = results[0]

        if(user.password !== password) return res.status(404).json({message:"Invalid credentials"})

        return res.status(200).json({message:"SignIn Successfull",userId:user.id})
    })
}

const allProducts = (req,res,next) =>{
    const userId = req.query.id

    if(!userId) return res.status(404).json({message:"failed to retrieve the UserId"})

    pool.query('SELECT * FROM consumer WHERE id=?',[userId],(err,results)=>{
        if(err) return res.status(500).json({message:"Internal Server Error",details:err})

        if(results.length === 0) return res.status(404).json({message:"Unable to find the user"})
        
        const user = results[0]

        pool.query('SELECT * FROM products WHERE totalQuantity>? ',[0],(err,results)=>{
            if(err) return res.status(500).json({message:"Internal Server Error",details:err})
            
            const filteredResults = results.filter(food=>food.location === user.location)

            return res.status(200).json(filteredResults)
        })
    })
}

const orderProduct = (req, res) => {
  const cartItems = req.body;
  const consumerId = req.query.consumerId;

  if (!consumerId) {
    return res.status(401).json({ message: "Login required" });
  }

  // Calculate totalRate
  let totalRate = 0;
  for (const item of cartItems) {
    totalRate += item.pricePerKg * item.cartQuantity;
  }

  pool.getConnection((err, conn) => {
    if (err) {
      return res.status(500).json({ message: "DB connection failed" });
    }

    conn.beginTransaction(err => {
      if (err) {
        conn.release();
        return res.status(500).json({ message: "Failed to start transaction" });
      }

      // Insert into orders
      conn.query(
        'INSERT INTO orders (consumerId, totalRate) VALUES (?, ?)',
        [consumerId, totalRate],
        (err, orderResult) => {
          if (err) {
            return conn.rollback(() => {
              conn.release();
              res.status(500).json({ message: "Failed to insert order" });
            });
          }

          const orderId = orderResult.insertId;

          // Function to process each cart item sequentially
          let i = 0;
          function processItem() {
            if (i >= cartItems.length) {
              // All items processed, commit transaction
              return conn.commit(err => {
                if (err) {
                  return conn.rollback(() => {
                    conn.release();
                    res.status(500).json({ message: "Failed to commit transaction" });
                  });
                }
                conn.release();
                return res.status(201).json({ message: "Order placed successfully", orderId });
              });
            }

            const item = cartItems[i];

            // Update product quantity if enough stock
            conn.query(
              'UPDATE products SET totalQuantity = totalQuantity - ? WHERE id = ? AND totalQuantity >= ?',
              [item.cartQuantity, item.id, item.cartQuantity],
              (err, updateResult) => {
                if (err || updateResult.affectedRows === 0) {
                  return conn.rollback(() => {
                    conn.release();
                    res.status(400).json({ message: `Product "${item.name}" not available in sufficient quantity.` });
                  });
                }

                // Insert into order_items
                conn.query(
                  'INSERT INTO order_items (order_id, product_id, quantity, pricePerKg) VALUES (?, ?, ?, ?)',
                  [orderId, item.id, item.cartQuantity, item.pricePerKg],
                  (err) => {
                    if (err) {
                      return conn.rollback(() => {
                        conn.release();
                        res.status(500).json({ message: "Failed to insert order item" });
                      });
                    }

                    i++;
                    processItem(); // process next item
                  }
                );
              }
            );
          }

          // Start processing cart items
          processItem();
        }
      );
    });
  });
};


module.exports = { signUp, signIn, allProducts, orderProduct }