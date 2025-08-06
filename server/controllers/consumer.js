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

module.exports = { signUp, signIn, allProducts }