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
})
