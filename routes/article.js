'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const Article = require('../models/ArticleModel.js')
const Keyword = require('../models/KeywordModel.js')

const router = express.Router()

router.post('/vote', (req, res) => {
    let amount = getAmount(req.body.vote)
    console.log(`votes modified by ${amount} for ${req.body.id}`)
    if (amount === 0) {
        res.status(500).send({
            err: "Invalid value for vote",
            reqBody: req.body
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
                // save keywords, add to their points
                console.log(`modifying ${word}`)
                Keyword.findOne({word})
                    .then((keyword) => {
                        console.log(`keyword.votes: ${keyword.votes}`)
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
                        console.log(`not found ${word}`)
                        let keyword = new Keyword({
                            word,
                            votes: [{
                                sum: amount,
                                time: Date.now()
                            }]
                        })
                        keyword.save()
                    })
            })
            console.log(`article: ${articleChanged}`)
            res.send(articleChanged)
        })
        .catch((err) => {
            res.status(500).send({
                err,
                reqBody: req.body
            })
        })
})

router.get('/top', (req, res) => {
    let findParams = {}
    if (req.query.lastVote && req.query.lastDate) {
        findParams = {
            votes: { $lte: req.query.lastVote },
            publishedAt: { $lt: req.query.lastDate }
        }
    }

    const sortParams = {
        votes: -1,
        publishedAt: -1
    }

    getNextArticles(findParams, sortParams)
        .then(articles => res.send(articles))
        .catch((err) => {
            res.status(500).send({
                err: `Articles weren't found: ${err}`,
                reqQuery: req.query
            })
        })
})

router.get('/new', (req, res) => {
    let findParams = {}
    if (req.query.lastDate) {
        findParams = { publishedAt: { $lt: req.query.lastDate } }
    }
    const sortParams = {
        publishedAt: -1
    }
    
    getNextArticles(findParams, sortParams)
        .then(articles => res.send(articles))
        .catch((err) => {
            res.status(500).send({
                err: `Newest articles weren't found: ${err}`,
                reqQuery: req.query
            })
        })
})

router.get('/:id', (req, res) => {
    Article.findById(req.params.id)
        .then((article) => {
            res.send(article) 
        })
        .catch((err) => {
            res.status(500).send({
                err,
                reqParams: req.params
            })
        })
})

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

module.exports = router
