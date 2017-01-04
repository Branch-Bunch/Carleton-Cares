'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Keyword = require('../models/KeywordModel.js')

const router = express.Router()

router.get('/:word', (req, res) => {
    let word = req.params.word
    Keyword.find({ word }).lean().then((wordList) => {
        res.send(wordList[0].votes)
    }).catch((err) => {
        res.status(500).send({
            err: `Keyword not found: ${err}`,
            givens: req.params
        })
    })
})

module.exports = router
