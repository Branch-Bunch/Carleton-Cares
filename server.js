'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const Promise = require('promise')
const memeRoute = require('./routes/meme.js')

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = Promise

const PORT = 42069

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

app.use('/memes', memeRoute)
