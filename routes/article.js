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
            file.data.keyphrases.forEach(function (phrase) {
                words.push(sanitize(phrase.matches[0].nodes.map(nlcstToString).join('')))
            })
    })
    //console.log(article)
    return words
}

function sanitize(string) {
    string = string.toLowerCase()
    return string.replace(/[^0-9a-zA-Z ,.]/g, '');
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
    let amount = parseInt(req.body.vote, 10)
    Article.findById(req.body.id).then((found) => {
        if (!found.length) {
            found.votes += amount
            return found.save()
        }
        return false
    }).then((data) => {
        if (data) {
            console.log(data.keywords)
            data.keywords.forEach((word) =>{
                // save keywords, add to their points
                word = word.toLowerCase()
                console.log(word)
                Keyword.find({word: word}).then((found) => {

                    if (!found.length) {
                        //console.log(found)
                        let keyw = new Keyword()
                        let novote = {sum: 0, time: Date.now()}
                        keyw['votes'] = []
                        keyw['votes'].push(novote)
                        keyw['word'] = word
                        console.log(word)
                        return keyw.save()
                    } else {
                        //just update it
                        console.log(`found========= ${found}`)
                        Object.keys(found).forEach((slot) => {
                            if (slot.word == word) {
                                console.log(`SLOT ====== ${slot}`)
                                let len = slot.votes.length
                                let newVote = {sum: slot.votes[len - 1] + amount, time: Date.now()}
                                slot.votes.push(newVote)
                                return found.save()
                            }
                        })
                    }

                })

            })
        }
    })
    res.status(200).end()
})

router.get('/purge', (req, res) => {
    // update db from NewsAPI.org
    // not purging on main build
    updateNews()
})

router.get('/dall', (req, res) => {

    // no
})

module.exports = router
