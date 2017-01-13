const express = require('express')
const Article = require('../models/ArticleModel')
const incrementKeyword = require('./keyword').incrementKeyword

const router = express.Router()

function getNextArticles(findParams, sortParams) {
  return new Promise((resolve, reject) => {
    Article.find(findParams)
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
  if (!amount) {
    res.status(500).send({
      err: 'Invalid value for vote',
      givens: req.body,
    })
    return
  }

  Article.findById(req.body.id)
    .then((article) => {
      if (!article) throw new Error('Article not found')
      article.votes += amount
      return article.save()
    })
    .then((article) => {
      Promise.all(article.keywords.map(keyword => incrementKeyword(keyword, amount)))
        .then((keywords) => {
          res.send({
            votes: article.votes,
            id: article.id,
            keywords,
          })
        })
        .catch(err => err)
    })
    .catch((err) => {
      res.status(500).send({
        err: err.toString(),
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
        err: err.toString(),
        givens: req.params,
      })
    })
})

module.exports = router
