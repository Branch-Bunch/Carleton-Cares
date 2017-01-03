const request = require('request-promise')
const retext = require('retext')
const retextkeywords = require('retext-keywords')
const nlcstToString = require('nlcst-to-string')
const Article = require('../models/ArticleModel.js')

// 3 600 000 is 1 hour
const REFRESH = 3600000

module.exports.startFetchCycle = () => {
    setInterval(() => {
        updateNews()
        console.log('ran') 
    }, REFRESH)
}

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
                        // already in database, add to database
                        if (!article) {
                            let article = new Article(old)
                            article.keywords = getPhrases(article)
                            article.votes = 0
                            console.log(article)
                            article.save()
                        }
                    })
                    .catch((err) => {
                        console.log('Error finding or saving article', err)
                    })
            })
        })
        .catch((err) => {
            console.log(err)
        })
}
