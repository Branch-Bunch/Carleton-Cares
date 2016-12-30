'use strict'

const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const articleRoute = require('./routes/article.js')
const keywordRoute = require('./routes/keyword.js')

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = Promise

const PORT = process.env.PORT

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static(__dirname + '/public'));
app.use('/articles', articleRoute)
app.use('/keywords', keywordRoute)

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

module.exports = app
