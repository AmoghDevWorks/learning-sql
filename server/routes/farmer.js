const express = require('express')
const { signUp } = require('../controllers/farmer')

const router = express.Router()

router.post('/signUp',signUp)

module.exports = router