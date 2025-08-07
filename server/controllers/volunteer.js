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

const getOrderFromLocation = (req,res,next) => {
    const location = req.query.location

    pool.query('SELECT orders.* FROM orders JOIN consumer ON orders.consumerId = consumer.id WHERE consumer.location = ? AND deliveryAssigned = ?',[location,false],(err,results)=>{
        if(err) return res.status(500).json({message:"Internal Server Error"})

        return res.status(200).json(results)
    })
}



module.exports = { signUp,signIn,getOrderFromLocation }