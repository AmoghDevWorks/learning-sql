const express = require('express')
const { signUp, signIn, getOrderFromLocation, takeDelivery }  = require('../controllers/volunteer')

const router = express.Router()

router.post('/signUp',signUp)
router.post('/signIn',signIn)
router.get('/getOrderFromLocation',getOrderFromLocation)
router.post('/takeDelivery',takeDelivery)

module.exports = router