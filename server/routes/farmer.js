const express = require('express')
const { signUp, signIn, uploadProduct } = require('../controllers/farmer')

const router = express.Router()

router.post('/signUp', signUp)
router.post('/signIn', signIn)
router.post('/uploadProduct', uploadProduct)

module.exports = router