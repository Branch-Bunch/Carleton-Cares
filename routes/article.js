'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Article = require('../models/ArticleModel.js')
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
            file.data.keyphrases.forEach(function (phrase) {
                words.push(sanitize(phrase.matches[0].nodes.map(nlcstToString).join('')))
            })
    })
    //console.log(article)
    return words
}

function sanitize(string) {
    return string.replace(/[^0-9a-zA-Z ,.]/g, '');
}

function dropArticles() {
    Article.remove({}, () => {})
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

router.get('/', (req, res) => {
    Article.find().lean().then((articleList) => {
        res.send(articleList)
    }).catch((err) => {
        console.log(err)
        res.status(500).end()
    })
})

router.post('/vote', (req, res) => {
    console.log(`votes modified by ${req.body.vote} for ${req.body.id}`)
    console.log(req.body)
    Article.findById(req.body.id).then((found) => {
        if (!found.length) {
            found.votes += parseInt(req.body.vote, 10)
            return found.save()
        }
        return false
    }).then((data) => {
        if (data) {
            console.log(data.keywords)
            data.keywords.forEach((art) =>{
                // save keywords, add to their points
                console.log(art)

            })
        }
    })
})

router.get('/purge', (req, res) => {
    // update db from NewsAPI.org
    // not purging on main build
})

router.get('/dall', (req, res) => {
    // dropArticles()
    // no
})

module.exports = router
