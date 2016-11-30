'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Article = require('../models/ArticleModel.js')
const Keyword = require('../models/KeywordModel.js')
const request = require('request')
const retext = require('retext')
const retextkeywords = require('retext-keywords')
const nlcstToString = require('nlcst-to-string')

const router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
    extended: true
}))

// 3 600 000 is 1 hour
const REFRESH = 300000

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
    request(url, (err, res, body) => {
        if (!err && res.statusCode == 200) {
            const headlines = JSON.parse(body).articles
            let articles = headlines.map((old) => {
                // save art
                Article.find({url: old.url}).then((found) => {
                    if (!found.length) {
                        let art = new Article()
                        Object.keys(old).forEach((key) => {
                            art[key] = old[key]
                        })
                        art['keywords'] = getPhrases(art)
                        art['votes'] = 0
                        console.log(art)
                        return art.save()
                    } else {
                        console.log(found)
                    }
                }).catch((err) => {
                    console.log(err)
                })

            })

        } else {
            console.log(err)
        }
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
            error: "Invalid value for vote",
            reqBody: req.body
        })
        return
    }

    let article = null
    Article.findById(req.body.id).then((art) => {
        art.votes += amount
        article = art
        return art.save()
    }).then((data) => {
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
                .catch((error) => {
                    console.log(`not found ${word}`)
                    let keyw = new Keyword({
                        word,
                        votes: [{
                            sum: amount,
                            time: Date.now()
                        }]

                    })
                    keyw.save()
                })
        })
        console.log(`article: ${article}`)
        res.status(200).send(article)
        return

    })
    .catch((error) => {
        res.status(500).send({
            error,
            reqBody: req.body
        })
        return
    })
})

router.get('/:id', (req, res) => {
    Article.findById(req.params.id).then((art) => {
       res.status(200).send(art) 
    }).catch((error) => {
        res.status(500).send({
            error,
            reqParams: req.params
        })
    })
})

module.exports = router
