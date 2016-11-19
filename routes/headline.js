'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Meme = require('../models/HeadlineModel.js')

const router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
    extended: true
}))

router.get('/', (req, res) => {
    Meme.find().lean().then((memeList) => {
        console.log(memeList)
        res.send(memeList)
    }).catch((err) => {
        console.log(err)
        res.status(500).end()
    })
})

module.exports = router
