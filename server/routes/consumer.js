const express = require('express')
const { signUp } = require('../controllers/consumer')

const router = express.Router()

router.post('/signUp',signUp)

module.exports = router