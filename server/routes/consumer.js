const express = require('express')
const { signUp, signIn, allProducts, orderProduct, previousAndCurrentOrders } = require('../controllers/consumer')

const router = express.Router()

router.post('/signUp',signUp)
router.post('/signIn',signIn)
router.get('/allProducts',allProducts)
router.post('/orderProduct',orderProduct)
router.get('/previousAndCurrentOrders',previousAndCurrentOrders)

module.exports = router