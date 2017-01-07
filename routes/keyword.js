const express = require('express')
const Keyword = require('../models/KeywordModel')

const router = express.Router()

router.get('/top', (req, res) => {
  Keyword
    .find()
    .lean()
    .then((wordList) => {
      const topWords = wordList.reduce((accumulator, word) => {
        const wordSum = word.votes[word.votes.length - 1].sum
        const topSum = accumulator.sum
        if (wordSum > topSum) {
          accumulator.words = [word]
          accumulator.sum = wordSum
        }
        if (wordSum === topSum) {
          accumulator.words.push(word)
        }
        return accumulator
      }, {
        sum: 0,
        words: [],
      })
      res.send(topWords.words)
    })
    .catch((err) => {
      res.status(500).send({
        err: err.toString(),
        givens: req.query,
      })
    })
})

router.get('/:word', (req, res) => {
  const word = req.params.word
  Keyword.find({ word })
    .lean()
    .then(words => res.send(words[0].votes))
    .catch((err) => {
      res.status(500).send({
        err: err.toString(),
        givens: req.params,
      })
    })
})

module.exports = router
