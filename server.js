'use strict'

const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const Promise = require('promise')
const memeRoute = require('./routes/topic.js')

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = Promise

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

app.use('/memes', memeRoute)
