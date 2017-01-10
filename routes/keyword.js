'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Keyword = require('../models/KeywordModel.js')

const router = express.Router()

router.get('/:word', (req, res) => {
    let word = req.params.word
    Keyword.findOne({ word }).lean().then((foundWord) => {
        res.send(foundWord)
    }).catch((err) => {
        res.status(500).send({
            err: `Keyword not found: ${err}`,
            givens: req.params
        })
    })
})

function incrementKeyword(word, amount) {
    return new Promise((resolve, reject) => {
        Keyword.findOne({ word })
            .then((keyword) => {
                if (!keyword) throw new Error('Keywords is not array')
                let votes = keyword.votes
                let len = votes.length
                let oldSum = keyword.votes[len - 1].sum
                let newSum = oldSum + amount

                let newVote = {
                    sum: newSum,
                    time: Date.now()
                }
                votes.push(newVote)
                keyword.save()
                resolve({ word: keyword.word, newSum, oldSum })
            })
            .catch((err) => {
                let oldSum = 0
                let newSum = oldSum + amount
                let newVote = {
                        sum: newSum,
                        time: Date.now()
                }

                let keyword = new Keyword({
                    word,
                    votes: [newVote]
                })
                keyword.save()
                resolve({ word: keyword.word, newSum, oldSum })
            })
    })
}

function incrementKeywords(words, amount) {
    words.forEach((word, i) => {
        words[i] = incrementKeyword(word, amount)
    })
    return words
}

module.exports = { router, incrementKeywords }
