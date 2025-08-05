const express = require('express')
const pool = require('../config/db')

const signUp = (req,res,next) =>{
    const { name, email, password, contactInfo } = req.body

    if(!name || !email || !password || !contactInfo) return res.status(400).json({message:"All fields are required"})

    pool.query('INSERT INTO farmer (name,email,password,contact) VALUES (?,?,?,?)',[name,email,password,contactInfo],(err,results)=>{
        if(err){
            if(err.code === 'ER_DUP_ENTRY') return res.status(404).json({message:"Account with email already exists",detail:err})
            return res.status(500).json({message:"internal Server Error",detail:err})
        }

        return res.status(201).json({message:"successful sign In",userId:results.insertId})
    })
}

const signIn = (req,res,next) =>{
    const { email, password } = req.body

    pool.query('SELECT * FROM farmer WHERE email = ?',[email],(err,results)=>{
        if(err) return res.status(500).json({message:"Internal Server Error"})
        if(results.length === 0) return res.status(404).json({message:"Invalid Email Id"})
        if(results[0].password !== password) return res.status(404).json({message:"Invalid credentials"})

        return res.status(200).json({message:"SignIn successfully",userId:results[0].id})
    })
}

const uploadProduct = (req,res,next) => {
    const { name, description, totalQuantity, pricePerKg, harvestDate, farmName, location, category } = req.body 
}

module.exports = { signUp, signIn, uploadProduct }