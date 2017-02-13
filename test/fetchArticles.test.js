const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')
const sanitize = require('../scripts/fetchArticles').sanitize

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

    })

    it('should have the votes property added, and initialized to 0', (done) => {

    })

    it('should exist in the database after being upserted', (done) => {

    })

  })
})
