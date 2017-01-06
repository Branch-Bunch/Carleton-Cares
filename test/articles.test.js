const chai = require ('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
const app = require('../server.js')

chai.use(chaiHttp)

describe('/articles Route', () => {
    const date = new Date()
    date.setDate(date.getDate() - 1)
    const lastDate = date.toISOString()
    const longAgoDate = new Date('1/1/2000').toISOString()
    const lastVote = 1

    describe('GET /articles/top', () => {
        it('should have right format response and right properties in articles', (done) => {
            chai.request(app)
                .get('/articles/top')
                .end((err, res) => {
                    checkReponse(res)
                    checkArticleProperties(res)
                    done()
                })
        })

        it('should be in sorted order from greatest to least', (done) => {
            chai.request(app)
                .get('/articles/top')
                .end((err, res) => {
                    checkVotesSorted(res)
                    done()
                })
        })
    })

    describe('GET /articles/:id', () => {
        it('should respond with single article of same id', (done) => {
            const id = '5846399f9ba87af2501fb035'
            chai.request(app)
                .get(`/articles/${id}`)
                .end((err, res) => {
                    checkSingleArticleProperties(res.body)
                    res.body._id.should.equal(id)
                    done()
                })
        })

        it('should respond with an error if an article id is not found', (done) => {
            const fakeId = '5846399f9ba87af2501fb03f'
            chai.request(app)
                .get(`/articles/${fakeId}`)
                .end((err, res) => {
                    checkValidError(res)
                    res.body.givens.id.should.equal(fakeId)
                    done()
                })
        })

        it('should respond with an error if the id supplied is not in the valid id format', (done) => {
            const invalidId = 'notavalidId'
            chai.request(app)
                .get(`/articles/${invalidId}`)
                .end((err, res) => {
                    checkValidError(res)
                    res.body.givens.id.should.equal(invalidId)
                    done()
                })
        })
    })

    describe('GET /articles/top with querys', () => {
        it('should have right format response and right properties in articles', (done) => {
            chai.request(app)
                .get('/articles/top')
                .query({ lastVote, lastDate })
                .end((err, res) => {
                    checkReponse(res)
                    checkArticleProperties(res)
                    done()
                })
        })

        it('should be in sorted order from greatest to least', (done) => {
            const lastDate = new Date()
            lastDate.setDate(lastDate.getDate() - 1)
            chai.request(app)
                .get('/articles/top')
                .query({ lastVote, lastDate })
                .end((err, res) => {
                    checkVotesSorted(res)
                    done()
                })
        })

        it('should have votes less than lastVote and publishedAt less than lastDate', (done) => {
            chai.request(app)
                .get('/articles/top')
                .query({ lastVote, lastDate })
                .end((err, res) => {
                    const article = res.body[0]
                    article.votes.should.be.at.most(lastVote)
                    article.publishedAt.should.be.below(lastDate)
                    done()
                })
        })

        it('should send empty array', (done) => {
            chai.request(app)
                .get('/articles/top')
                .query({ lastVote: -999, lastDate: longAgoDate })
                .end((err, res) => {
                    res.body.should.be.array
                    res.body.should.be.empty
                    done()
                })
        })
    })

    describe('GET /articles/new', () => {
        it('should have right format response and right properties in articles', (done) => {
            chai.request(app)
                .get('/articles/new')
                .end((err, res) => {
                    checkReponse(res)
                    checkArticleProperties(res)
                    done()
                })
        })

        it('should be in sorted order from newest to oldest', (done) => {
            chai.request(app)
                .get('/articles/new')
                .end((err, res) => {
                    checkDateSorted(res)
                    done()
                })
        })
    })

    describe('GET /articles/new with query', () => {
        it('should have right format response and right properties in articles', (done) => {
            chai.request(app)
                .get('/articles/new')
                .query({ lastDate })
                .end((err, res) => {
                    checkReponse(res)
                    checkArticleProperties(res)
                    done()
                })
        })

        it('should be in sorted order from newest to oldest', (done) => {
            chai.request(app)
                .get('/articles/new')
                .query({ lastDate })
                .end((err, res) => {
                    checkDateSorted(res)
                    done()
                })
        })

        it('should have date less than lastDate', (done) => {
            chai.request(app)
                .get('/articles/new')
                .query({ lastDate })
                .end((err, res) => {
                    const article = res.body[0]
                    article.publishedAt.should.be.below(lastDate)
                    done()
                })
        })

        it('should send empty array', (done) => {
            chai.request(app)
                .get('/articles/new')
                .query({ lastDate: longAgoDate })
                .end((err, res) => {
                    res.body.should.be.array
                    res.body.should.be.empty
                    done()
                })
        })
    })

    describe('POST /articles/vote', () => {
        const id = '5846399f9ba87af2501fb035'
        const fakeId = '5846399f9ba87af2501fb03f'

        it('should respond with the updated article when a valid id, and positive vote are supplied', (done) => {
            getArticleData(id)
                .then(articleResponse1 => articleResponse1.body.votes + 1)
                .then(expectedRaisedVote => postVote(id, 1, expectedRaisedVote))
                .then((voteResponse) => {
                    checkSingleArticleProperties(voteResponse.res.body)
                    voteResponse.res.body._id.should.equal(id)
                    voteResponse.res.body.votes.should.equal(voteResponse.expected)
                })

                .then(() => getArticleData(id))
                .then(articleResponse2 => articleResponse2.body.votes - 1)
                .then(expectedLoweredVote => postVote(id, -1, expectedLoweredVote))
                .then((voteResponse) => {
                    checkSingleArticleProperties(voteResponse.res.body)
                    voteResponse.res.body._id.should.equal(id)
                    voteResponse.res.body.votes.should.equal(voteResponse.expected)
                })

                .then(() => postVote(fakeId, 1, 'error'))
                .then((errorResponse) => {
                    checkValidError(errorResponse.res)
                    errorResponse.res.body.givens.id.should.equal(fakeId)
                })

                .then(() => postVote(id, 'badVote', 'error'))
                .then((errorResponse) => {
                    checkValidError(errorResponse.res)
                    errorResponse.res.body.givens.id.should.equal(id)
                })

                .then(() => getArticleData(id))
                .then(res => getKeywords(res.body.keywords))
                .then(keywords => postVote(id, -1, keywords))
                .then(voteResponse => getKeywordData(voteResponse, voteResponse.res.body.keywords))
                .then((keywordResponse) => {
                    checkKeywords(keywordResponse.voteResponse.expected, keywordResponse.newKeywords, -1)
                })

                .then(() => getArticleData(id))
                .then(res => getKeywords(res.body.keywords))
                .then(oldKeywords => postVote(id, 1, oldKeywords))
                .then(voteResponse => getKeywordData(voteResponse, voteResponse.res.body.keywords))
                .then((keywordResponse) => {
                    checkKeywords(keywordResponse.voteResponse.expected, keywordResponse.newKeywords, 1)
                    done()
                })
                .catch(err => done(err))
        })
    })
})

function postVote(id, vote, expected) {
    return new Promise((resolve, reject) => {
        chai.request(app)
            .post('/articles/vote')
            .send({ id, vote })
            .end((err, res) => {
                resolve({res, expected})
            })
    })
}

function getArticleData(id) {
    return new Promise((resolve, reject) => {
        chai.request(app)
            .get(`/articles/${id}`)
            .end((err, res) => {
                if (err) reject(err)
                resolve(res)
            })
    })
}

function getKeywordData(voteResponse, newKeywordsArray) {
    return new Promise((resolve, reject) => {
        getKeywords(newKeywordsArray).then(newKeywords => resolve({ voteResponse, newKeywords, })) 
    })
}

function getKeywords(stringWords) {
    return new Promise((outerResolve, outerReject) => {
        const keywords = stringWords.map((word) => {
            return new Promise((resolve, reject) => {
                chai.request(app)
                    .get(`/keywords/${word}`)
                    .end((err, res) => {
                        if (err) reject(err)
                        resolve(res.body)
                    })
            })
        })
        Promise.all(keywords)
            .then((words) => {
                outerResolve(words)
            })
            .catch(err => console.log(err))
    })
}

function checkReponse(res) {
    res.should.have.status(200)
    res.body.should.be.arrary
    res.body.should.not.be.empty
    res.body.length.should.be.at.most(10)
}

function checkValidError(res) {
    res.should.have.status(500)
    res.body.should.not.be.empty
    res.body.should.have.property('err')
    res.body.should.have.property('givens')
}

function checkArticleProperties(res) {
    res.body.forEach((article) => {
        checkSingleArticleProperties(article)
    })
}

function checkSingleArticleProperties(article) {
    article.should.have.property('author')
    article.should.have.property('title')
    article.should.have.property('description')
    article.should.have.property('url')
    article.should.have.property('urlToImage')
    article.should.have.property('votes')
    article.should.have.property('publishedAt')
    article.should.have.property('keywords')
    article.keywords.should.be.array
}

function checkKeywords(oldWords, updatedWords, vote) {
    const newKeywordAmount = updatedWords.length
    const oldKeywordAmount = oldWords.length
    newKeywordAmount.should.equal(oldKeywordAmount)
    updatedWords.forEach((word, index) => {
        checkKeyword(oldWords[index], word, vote)
    })
}

function checkKeyword(oldKeyword, newKeyword, vote) {
    const newLength = newKeyword.votes.length
    const oldLength = oldKeyword.votes.length
    newLength.should.equal(oldLength + 1)
    const latest = newKeyword.votes[newLength - 1].sum
    const older = oldKeyword.votes[oldLength - 1].sum
    latest.should.equal(older - vote)
}

function checkVotesSorted(res) {
    const articles = res.body
    const sorted = articles.every((val, i, arr) => i === 0 || arr[i - 1].votes >= val.votes)
    sorted.should.be.true
}

function checkDateSorted(res) {
    const articles = res.body
    const sorted = articles.every((val, i, arr) => i === 0 || arr[i - 1].publishedAt >= val.publishedAt)
    sorted.should.be.true
}
