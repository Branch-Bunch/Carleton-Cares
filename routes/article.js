'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const Article = require('../models/ArticleModel.js')
const Keyword = require('../models/KeywordModel.js')
const request = require('request-promise')
const retext = require('retext')
const retextkeywords = require('retext-keywords')
const nlcstToString = require('nlcst-to-string')

const router = express.Router()

// 3 600 000 is 1 hour
const REFRESH = 3600000

setInterval(() => {
    updateNews()
    console.log('ran') 
}, REFRESH)

function getWords(article) {
    let words = []
    retext().use(retextkeywords).process(
        `${article.title} ${article.description}`, (err, file) => {
            file.data.keywords.forEach((keyword) => {
                // sanitize it
                let word = sanitize(nlcstToString(keyword.matches[0].node))
                words.push(nlcstToString(keyword.matches[0].node))
            })
        })
    //console.log(article)
    return words
}

function getPhrases(article) {
    let words = []
    retext().use(retextkeywords).process(
        `${article.title} ${article.description}`, (err, file) => {
            file.data.keyphrases.forEach((phrase) => {
                words.push(sanitize(phrase.matches[0].nodes.map(nlcstToString).join('')))
            })
        })
    //console.log(article)
    return words
}

function sanitize(string) {
    // formats the string to lowercase, and removes all punctuation
    string = string.toLowerCase()
    return string.replace(/[^0-9a-z ]/g, '')
}

function dropArticles() {
    Article.remove({}, () => {})
    Keyword.remove({}, () => {})
}

function updateNews() {
    // hourly
    const url = `${process.env.NEWS_URI}`
    request(url)
        .then((res) => {
            const headlines = JSON.parse(res).articles
            let articles = headlines.map((old) => {
                // save art
                Article.findOne({url: old.url})
                    .then((article) => {
                        // already in database, do nothing
                        if (!article) throw new Error('Article not found')
                    })
                    .catch((err) => {
                        // not in db
                        let article = new Article(old)
                        article['keywords'] = getPhrases(article)
                        article['votes'] = 0
                        console.log(article)
                        article.save()
                    })
            })
        })
        .catch((err) => {
            console.log(err)
        })
}

function getAmount(vote) {
    return Math.abs(vote) / vote || 0
}

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

module.exports = router
