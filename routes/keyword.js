'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Keyword = require('../models/KeywordModel.js')

const router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
    extended: true
}))

router.get('/', (req, res) => {
    Meme.find().lean().then((keywordList) => {
        console.log(keywordList)
        res.send(keywordList)
    }).catch((err) => {
        console.log(err)
        res.status(500).end()
    })
})

module.exports = router
