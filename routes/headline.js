'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Headline = require('../models/HeadlineModel.js')
const request = require('request')
const retext = require('retext')
const retextkeywords = require('retext-keywords')
const nlcstToString = require('nlcst-to-string')

const router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
    extended: true
}))

router.get('/', (req, res) => {
    Headline.find().lean().then((headlineList) => {
        console.log(headlineList)
        res.send(headlineList)
    }).catch((err) => {
        console.log(err)
        res.status(500).end()
    })
})

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
                words.push(phrase.matches[0].nodes.map(nlcstToString).join(''))
            })
    })
    //console.log(article)
    return words
}

function updateNews() {
    // hourly
    const url = `${process.env.NEWS_URI}`
    request(url, (err, res, body) => {
        if (!err && res.statusCode == 200) {
            const headlines = JSON.parse(body).articles
            
            let articles = headlines.map((old) => {
                let headline = {}
                Object.keys(old).forEach((key) => {
                    headline[key] = old[key]
                })
                headline['Keywords'] = getPhrases(headline)
                console.log(headline)
            })
            // save articles

        } else {
            console.log(err)
        }
    })
}

router.get('/purge', (req, res) => {
    // update db from NewsAPI.org
    updateNews()
    res.send('purged')
})

module.exports = router
