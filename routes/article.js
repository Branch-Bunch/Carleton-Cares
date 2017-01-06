const express = require('express')
const Article = require('../models/ArticleModel')
const Keyword = require('../models/KeywordModel')

const router = express.Router()

function getNextArticles(findParams, sortParams) {
  return new Promise((resolve, reject) => {
    Article
      .find(findParams)
      .sort(sortParams)
      .limit(10)
      .lean()
      .then(articles => resolve(articles))
      .catch(err => reject(err))
  })
}

function getAmount(vote) {
  return Math.abs(vote) / vote || 0
}

router.post('/vote', (req, res) => {
  const amount = getAmount(req.body.vote)
  if (amount === 0) {
    res.status(500).send({
      err: 'Invalid value for vote',
      givens: req.body,
    })
    return
  }

  let articleChanged = null
  Article.findById(req.body.id)
    .then((article) => {
      article.votes += amount
      articleChanged = article
      return article.save()
    })
    .then((data) => {
      data.keywords.forEach((word) => {
        Keyword.findOne({ word })
          .then((keyword) => {
            const votes = keyword.votes
            const len = votes.length
            const newVote = {
              sum: votes[len - 1].sum + amount,
              time: Date.now(),
            }
            votes.push(newVote)
            keyword.save()
          })
          .catch((err) => {
            const keyword = new Keyword({
              word,
              votes: [{
                sum: amount,
                time: Date.now(),
              }],
            })
            keyword.save()
          })
      })
      res.send(articleChanged)
    })
    .catch((err) => {
      res.status(500).send({
        err,
        givens: req.body,
      })
    })
})

router.get('/top', (req, res) => {
  let findParams = {}
  if (req.query.lastVote && req.query.lastDate) {
    findParams = {
      votes: { $lte: req.query.lastVote },
      publishedAt: { $lt: req.query.lastDate },
    }
  }

  const sortParams = {
    votes: -1,
    publishedAt: -1,
  }

  getNextArticles(findParams, sortParams)
    .then(articles => res.send(articles))
    .catch((err) => {
      res.status(500).send({
        err: `Articles weren't found: ${err}`,
        givens: req.query,
      })
    })
})

router.get('/new', (req, res) => {
  let findParams = {}
  if (req.query.lastDate) {
    findParams = { publishedAt: { $lt: req.query.lastDate } }
  }

  const sortParams = {
    publishedAt: -1,
  }

  getNextArticles(findParams, sortParams)
    .then(articles => res.send(articles))
    .catch((err) => {
      res.status(500).send({
        err: `Newest articles weren't found: ${err}`,
        givens: req.query,
      })
    })
})

router.get('/:id', (req, res) => {
  Article.findById(req.params.id)
    .then((article) => {
      if (!article) throw new Error('No articles found')
      res.send(article)
    })
    .catch((err) => {
      res.status(500).send({
        err,
        givens: req.params,
      })
    })
})

module.exports = router
