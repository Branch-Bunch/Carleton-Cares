'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Headline = require('../models/HeadlineModel.js')

const router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
    extended: true
}))

router.get('/', (req, res) => {
    Headline.find().lean().then((headlineList) => {
        console.log(headlineList)
        res.send(headlineList)
    }).catch((err) => {
        console.log(err)
        res.status(500).end()
    })
})

module.exports = router
