const express = require('express')
const pool = require('../config/db')

const signUp = (req,res,next) =>{
    const { name, email, password, contactInfo } = req.body

    if(!name || !email || !password || !contactInfo) return res.status(400).json({message:"All fields are required"})

    pool.query('INSERT INTO farmer (name,email,password,contact) VALUES (?,?,?,?)',[name,email,password,contactInfo],(err,results)=>{
        if(err){
            console.error('Insert error:', err);
            if(err.code === 'ER_DUP_ENTRY') return res.status(404).json({message:"Account with email already exists",detail:err})
            return res.status(500).json({message:"internal Server Error",detail:err})
        }

        return res.status(201).json({message:"successful sign In",userId:results.insertId})
    })
}

module.exports = { signUp }