const express = require('express')
const cors = require('cors')
const farmerRoutes = require('./routes/farmer')

const app = express()
const PORT = 8000

app.use(cors())

app.use(express.urlencoded())
app.use(express.json())

app.use('/farmer',farmerRoutes)

app.listen(PORT,()=>{
    console.log('Server running in port',PORT)
})