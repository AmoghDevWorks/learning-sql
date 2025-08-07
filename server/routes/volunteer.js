const express = require('express')
const { signUp, signIn, getOrderFromLocation }  = require('../controllers/volunteer')

const router = express.Router()

router.post('/signUp',signUp)
router.post('/signIn',signIn)
router.get('/getOrderFromLocation',getOrderFromLocation)

module.exports = router