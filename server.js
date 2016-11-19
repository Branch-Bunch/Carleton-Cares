'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const Promise = require('promise')
const memeRoute = require('./routes/meme.js')

const mongoose = require('mongoose')
var mongoUri = process.env.MONGOLAB_URI
mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = Promise

const PORT = 42069

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

app.use('/memes', memeRoute)
