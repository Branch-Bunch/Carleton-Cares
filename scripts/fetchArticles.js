const request = require('request-promise')
const retext = require('retext')
const retextkeywords = require('retext-keywords')
const nlcstToString = require('nlcst-to-string')
const Article = require('../models/ArticleModel')

// 3 600 000 is 1 hour
const REFRESH = 3600000
const longAgoDate = new Date('1/1/2000').toISOString()

function sanitize(string) {
  // Removes all punctuation, sets spaces to hyphens, lowers the case
  const newString = string.toLowerCase().replace(/[^0-9a-z ]/g, '')
  return newString.replace(/\s+/g, '-')
}

function getPhrases(article) {
  const words = []
  retext()
    .use(retextkeywords)
    .process(`${article.title} ${article.description}`, (err, file) => {
      file.data.keyphrases.forEach((phrase) => {
        const newPhrase = phrase.matches[0].nodes
          .map(nlcstToString)
          .join('')
        words.push(sanitize(newPhrase))
      })
    })
  return words
}

function mapArticleToUpdatedArticle(article) {
  return new Promise((resolve, reject) => {
    if (article.publishedAt <= longAgoDate) article.publishedAt = new Date()
    Article.findOneAndUpdate({
      url: article.url,
    }, {
      author: article.author,
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt,
      keywords: getPhrases(article),
      votes: 0,
    }, {
      new: true,
      upsert: true,
      runValidators: true,
    })
      .then(newArticle => resolve(newArticle))
      .catch(err => reject(err))
  })
}

function updateNews() {
  request(process.env.NEWS_URI)
    .then((res) => {
      const articles = JSON.parse(res).articles
      Promise.all(articles.map(mapArticleToUpdatedArticle))
        .then(() => {})
        .catch(err => err)
    })
    .catch(err => err)
}

module.exports.startFetchCycle = () => {
  updateNews()
  setInterval(updateNews, REFRESH)
}
