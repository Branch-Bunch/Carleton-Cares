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

function checkKeywordAfterIncrement(first, last, vote) {
  first._id.should.equal(last.id)
  const len = first.votes.length
  first.votes[len - 1].sum.should.equal(last.oldSum)
  first.votes[len - 1].sum.should.equal(last.newSum - vote)
}

function getKeywordData(word) {
  return new Promise((resolve) => {
    chai.request(app)
      .get(`/keywords/${word}`)
      .end((err, res) => {
        resolve(res)
      })
  })
}

describe('keyword unit tests', () => {
  describe('incrementKeyword', () => {
    const word = 'panda'
    const wordDataPromise = getKeywordData(word)
    const fakeWord = 'no-real-word-here'

    it('should increment the votes for one keyword', (done) => {
      let initialKeyword = {}
      wordDataPromise
        .then((keywordResponse) => {
          initialKeyword = keywordResponse.body[0]
          return incrementKeyword(initialKeyword.word, 1)
        })
        .then((incrementedResponse) => {
          checkKeywordAfterIncrement(initialKeyword, incrementedResponse, 1)
          done()
        })
        .catch(err => done(err))
    })

    it('should decrement the votes for one keyword', (done) => {
      let initialKeyword = {}
      wordDataPromise
        .then(() => getKeywordData(word))
        .then((keywordResponse) => {
          initialKeyword = keywordResponse.body[0]
          return incrementKeyword(initialKeyword.word, -1)
        })
        .then((incrementedResponse) => {
          checkKeywordAfterIncrement(initialKeyword, incrementedResponse, -1)
          done()
        })
        .catch(err => done(err))
    })

    it('should fail for a word that is not in the database', (done) => {
      incrementKeyword(fakeWord, 1)
        .then(response => done(new Error(`Responded properly when it was expected to fail: {response}`)))
        .catch((err) => {
          err.should.have.property('message').be.a('string')
          done()
        })
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
    const fakeWord = 'this-is-not-real'
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
