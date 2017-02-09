const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server.js')
const incrementKeyword = require('../routes/keyword.js').incrementKeyword

chai.use(chaiHttp)


function checkResponse(res) {
  res.should.have.status(200)
  res.body.should.be.an('array')
  res.body.should.not.be.empty
}

function checkWord(keyword) {
  keyword.should.have.property('word')
  keyword.word.should.an('string')
  keyword.word.should.not.be.empty
}

function checkVotes(keyword) {
  keyword.should.have.property('votes')
  keyword.votes.should.be.an('array')
  keyword.votes.forEach((vote) => {
    vote.should.be.an('object')
    vote.should.have.property('time')
    vote.should.have.property('sum')
  })
}

function checkValidError(res) {
  res.should.have.status(500)
  res.body.should.not.be.empty
  res.body.should.have.property('err')
  res.body.should.have.property('givens')
}

describe('keyword unit tests', () => {
  describe('incrementKeyword', () => {
    const words = ['panda', 'trump']
    it('should increment the votes for all of the words specified', (done) => {
      done()
    })
  })
})

describe('/keywords Route', () => {
  describe('GET /keywords/top', () => {
    it('should be a non empty array', (done) => {
      chai.request(app)
        .get('/keywords/top')
        .end((err, res) => {
          checkResponse(res)
          done()
        })
    })

    it('should have a word element which is a non empty string', (done) => {
      chai.request(app)
        .get('/keywords/top')
        .end((err, res) => {
          res.body.forEach((keyword) => {
            checkWord(keyword)
          })
          done()
        })
    })

    it('should have a votes element which is a non empty array containing votes', (done) => {
      chai.request(app)
        .get('/keywords/top')
        .end((err, res) => {
          res.body.forEach((keyword) => {
            checkVotes(keyword)
          })
          done()
        })
    })
  })

  describe('GET /keywords/:word', () => {
    const testWord = 'panda'
    const fakeWord = 'fak3w0rd'
    it('should be a non empty array', (done) => {
      chai.request(app)
        .get(`/keywords/${testWord}`)
        .end((err, res) => {
          checkResponse(res)
          done()
        })
    })

    it('should have a word element which is a non empty string', (done) => {
      chai.request(app)
        .get(`/keywords/${testWord}`)
        .end((err, res) => {
          res.body.forEach((keyword) => {
            checkWord(keyword)
          })
          done()
        })
    })

    it('should have a votes element which is a non empty array containing votes', (done) => {
      chai.request(app)
        .get(`/keywords/${testWord}`)
        .end((err, res) => {
          res.body.forEach((keyword) => {
            checkVotes(keyword)
          })
          done()
        })
    })

    it('should respond with error', (done) => {
      chai.request(app)
        .get(`/keywords/${fakeWord}`)
        .end((err, res) => {
          checkValidError(res)
          done()
        })
    })
  })
})
