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

function incrementKeyword(word, amount) {
    Keyword.findOne({word})
        .then((keyword) => {
            if (!keyword) throw new Error('Keywords is not array')
            let votes = keyword.votes
            let len = votes.length
            let newVote = {
                sum: votes[len - 1].sum + amount,
                time: Date.now()
            }
            votes.push(newVote)
            keyword.save()
        })
        .catch((err) => {
            let keyword = new Keyword({
                word,
                votes: [{
                    sum: amount,
                    time: Date.now()
                }]
            })
            keyword.save()
        })
}

function incrementKeywords(words, amount) {
    words.forEach((word) => {
        incrementKeyword(word, amount)
    })
}

module.exports = { router, incrementKeywords }
