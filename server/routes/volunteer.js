const express = require('express')
const { signUp, signIn, getOrderFromLocation, takeDelivery, deliveredProducts, confirmDelivery, confirmOTP }  = require('../controllers/volunteer')

const router = express.Router()

router.post('/signUp',signUp)
router.post('/signIn',signIn)
router.get('/getOrderFromLocation',getOrderFromLocation)
router.post('/takeDelivery',takeDelivery)
router.get('/deliveredProducts',deliveredProducts)
router.post('/confirmDelivery',confirmDelivery)
router.post('/confirmOTP',confirmOTP)

module.exports = router