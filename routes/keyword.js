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
    Keyword.find().lean().then((keywordList) => {
        console.log(keywordList)
        res.send(keywordList)
    }).catch((err) => {
        console.log(err)
        res.status(500).end()
    })
})

router.get('/index', (req, res) => {
    let word = req.query.word
    Keyword.find({word: word}).lean().then((wordList) => {
        console.log(wordList)
        res.send(wordList)
    }).catch((err) => {
        console.log(err)
        res.satus(500).end
    })
})

router.get('/:word', (req, res) => {
    console.log(req.params)
    let word = req.params.word
    console.log(word)
    Keyword.find({word: word}).lean().then((wordList) => {
        console.log(wordList[0])
        console.log(wordList[0].votes)
        console.log(word)
        res.send(wordList[0].votes)
    }).catch((err) => {
        console.log(err)
        res.satus(500).end
    })
})

module.exports = router
