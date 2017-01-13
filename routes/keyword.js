const express = require('express')
const Keyword = require('../models/KeywordModel')

const router = express.Router()

router.get('/top', (req, res) => {
  Keyword.find()
    .lean()
    .then((wordList) => {
      const topWords = wordList.reduce((accumulator, word) => {
        const wordSum = word.votes[word.votes.length - 1].sum
        const topSum = accumulator.sum
        if (wordSum > topSum) {
          return {
            words: [word],
            sum: wordSum,
          }
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
        err,
        givens: req.query,
      })
    })
})

router.get('/:word', (req, res) => {
  const word = req.params.word
  Keyword.findOne({ word })
    .lean()
    .then((keyword) => {
      if (!keyword) throw new Error('Word not found')
      res.send([keyword])
    })
    .catch((err) => {
      res.status(500).send({
        err: err.toString(),
        givens: req.params,
      })
    })
})

function incrementKeyword(word, amount) {
  return new Promise((resolve) => {
    Keyword.findOne({ word })
      .then((keyword) => {
        let oldSum = 0
        if (!keyword) {
          keyword = new Keyword({
            word,
            votes: [],
          })
        } else {
          const len = keyword.votes.length
          oldSum = keyword.votes[len - 1].sum
        }
        const newSum = oldSum + amount
        const newVote = { sum: newSum, time: Date.now() }
        keyword.votes.push(newVote)
        keyword.save()
        resolve({ word: keyword.word, newSum, oldSum, id: keyword.id })
      })
      .catch(err => err)
  })
}

module.exports = { router, incrementKeyword }
