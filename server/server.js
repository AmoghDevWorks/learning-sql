const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 8000

app.use(express.urlencoded())
app.use(express.json())


app.listen(PORT,()=>{
    console.log('Server running in port',PORT)
})