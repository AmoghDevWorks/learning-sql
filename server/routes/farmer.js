const express = require('express')
const { signUp, signIn, uploadProduct, getAllProducts } = require('../controllers/farmer')

const router = express.Router()

router.post('/signUp', signUp)
router.post('/signIn', signIn)
router.post('/uploadProduct', uploadProduct)
router.get('/getAllProducts',getAllProducts)

module.exports = router