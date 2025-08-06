const express = require('express')
const { signUp, signIn, allProducts, orderProduct } = require('../controllers/consumer')

const router = express.Router()

router.post('/signUp',signUp)
router.post('/signIn',signIn)
router.get('/allProducts',allProducts)
router.post('/orderProduct',orderProduct)

module.exports = router