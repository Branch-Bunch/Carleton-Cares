const express = require('express')
const Keyword = require('../models/KeywordModel.js')

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
              if (!keyword) throw new Error('Keywords is not array')
              const votes = keyword.votes
              const len = votes.length
              const oldSum = keyword.votes[len - 1].sum
              const newSum = oldSum + amount

              const newVote = {
                sum: newSum,
                time: Date.now(),
              }
              votes.push(newVote)
              keyword.save()
              resolve({ word: keyword.word, newSum, oldSum })
            })
            .catch(() => {
              const oldSum = 0
              const newSum = oldSum + amount
              const newVote = {
                sum: newSum,
                time: Date.now(),
              }

              const keyword = new Keyword({
                word,
                votes: [newVote],
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
