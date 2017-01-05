const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const articleRoute = require('./routes/article.js')
const keywordRoute = require('./routes/keyword.js').router
const fetchArticles = require('./scripts/fetchArticles.js')

const app = express()

dotenv.config({ silent: true })
mongoose.connect(process.env.MONGO_URI)
mongoose.Promise = Promise

const PORT = process.env.PORT

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(`${__dirname}/public`))

app.use('/articles', articleRoute)
app.use('/keywords', keywordRoute)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

fetchArticles.startFetchCycle()

module.exports = app
