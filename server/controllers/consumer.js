const express = require('express')
const pool = require('../config/db')

const signUp = (req,res,next) => {
    const { fullName,email,password,phoneNumber } = req.body

    if( !fullName || !email || !password || !phoneNumber ) return res.status(404).json({message:"Fill the fields"})

    pool.query('INSERT INTO consumer (name, email, password, contact) VALUES (?, ?, ?, ?)',[fullName,email,password,phoneNumber],(err,results)=>{
        if(err){
            console.log(err)
            if(err.code === 'ER_DUP_ENTRY') return res.status(404).json({message:'Account already exists'})
            return res.status(500).json({message:"Internal Server Error"})
        }

        return res.status(200).json({message:"successfull signUp ",userId:results.insertId})
    })
}

module.exports = { signUp }