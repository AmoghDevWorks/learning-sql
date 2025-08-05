const express = require('express')
const { signUp, signIn, allProducts } = require('../controllers/consumer')

const router = express.Router()

router.post('/signUp',signUp)
router.post('/signIn',signIn)
router.get('/allProducts',allProducts)

module.exports = router