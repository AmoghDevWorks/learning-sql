const express = require('express')
const { signUp, signIn, getOrderFromLocation, takeDelivery, deliveredProducts, confirmDelivery }  = require('../controllers/volunteer')

const router = express.Router()

router.post('/signUp',signUp)
router.post('/signIn',signIn)
router.get('/getOrderFromLocation',getOrderFromLocation)
router.post('/takeDelivery',takeDelivery)
router.get('/deliveredProducts',deliveredProducts)
router.post('/confirmDelivery',confirmDelivery)

module.exports = router