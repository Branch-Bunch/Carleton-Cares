const request = require('request-promise')
const retext = require('retext')
const retextkeywords = require('retext-keywords')
const nlcstToString = require('nlcst-to-string')
const Article = require('../models/ArticleModel.js')

// 3 600 000 is 1 hour
const REFRESH = 3600000

function sanitize(string) {
  const newString = string.toLowerCase()
  // Removes all punctuation
  return newString.replace(/[^0-9a-z ]/g, '')
}

function getPhrases(article) {
  const words = []
  retext()
    .use(retextkeywords)
    .process(`${article.title} ${article.description}`, (err, file) => {
      file.data.keyphrases.forEach((phrase) => {
        words.push(
          sanitize(phrase.matches[0].nodes
            .map(nlcstToString)
            .join('')),
        )
      })
    })
  return words
}

function updateNews() {
  request(process.env.NEWS_URI)
    .then((res) => {
      const headlines = JSON.parse(res).articles
      headlines.forEach((old) => {
        Article.findOne({ url: old.url })
          .then((article) => {
            if (article) return
            const newArticle = new Article(old)
            newArticle.keywords = getPhrases(article)
            newArticle.votes = 0
            newArticle.save()
          })
          .catch(err => err)
      })
    })
    .catch(err => err)
}

module.exports.startFetchCycle = () => {
  setInterval(() => {
    updateNews()
  }, REFRESH)
}
