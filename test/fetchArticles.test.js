const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')
const Article = require('../models/ArticleModel')
const sanitize = require('../scripts/fetchArticles').sanitize
const mapArticleToUpdatedArticle = require('../scripts/fetchArticles').mapArticleToUpdatedArticle
const checkSingleArticleProperties = require('./article.test')

chai.should()
chai.use(chaiHttp)

describe('fetchArticles unit tests', () => {
  describe('sanitize', () => {
    it('should return a string that is only in lowercase', () => {
      const testString = 'LOWERCASE'
      sanitize(testString).should.equal('lowercase')
      sanitize(testString).should.not.equal(testString)
    })

    it('should return a string where each sequential space becomes a hyphen', () => {
      const testString = 'hello   world'
      const testString2 = 'hello   everyone   bye'
      sanitize(testString2).should.equal('hello-everyone-bye')
      sanitize(testString).should.equal('hello-world')
      sanitize(testString).should.not.equal(testString)
    })

    it('should return a properly formatted string', () => {
      const testString = 'Hello World!'
      sanitize(testString).should.equal('hello-world')
      sanitize(testString).should.not.equal(testString)
    })
  })

  describe('upserting the articles', () => {
    const longAgoDate = new Date('1/1/2000').toISOString()
    const testArticle = {
      author: 'JSON Bourne',
      title: 'JSON Bourne returns',
      description: 'Jesus Christ, is that JSON Bourne?',
      url: 'some-url',
      urlToImage: 'https://upload.wikimedia.org/wikipedia/en/6/60/Jason_bourne_infobox.jpg',
      publishedAt: '0001-01-01T00:00:00Z',
      keywords: [ 'JSON-Bourne', 'movies' ],
    }

    it('should have a recent date if the date supplied is before 2000', (done) => {
      mapArticleToUpdatedArticle(testArticle)
        .then(newArticle => {
          checkSingleArticleProperties(newArticle)
          const newDate = new Date(newArticle.publishedAt).toISOString()
          newDate.should.be.above(longAgoDate)
          done()
        })
        .catch(err => done(err))
    })

    it('should have the votes property added, and initialized to 0', (done) => {
      mapArticleToUpdatedArticle(testArticle)
        .then(newArticle => {
          checkSingleArticleProperties(newArticle)
          newArticle.should.have.property('votes').be.a('number').equal(0)
          done()
        })
        .catch(err => done(err))
    })

    it('should exist in the database after being upserted', (done) => {
      Article.findOne({ url: testArticle.url })
        .then(newArticle => {
          newArticle.should.not.be.null
          checkSingleArticleProperties(newArticle)
        })
        .then(() => {
          Article.findOneAndRemove({ url: testArticle.url })
            .then(() => done())
            .catch(err => err)
        })
        .catch(err => done(err))
    })
  })
})
