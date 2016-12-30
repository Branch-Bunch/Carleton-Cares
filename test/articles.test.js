const chai = require ('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
const app = require('../server.js')

chai.use(chaiHttp)

describe('/articles', () => {
    const date = new Date()
    date.setDate(date.getDate() - 1)
    const lastDate = date.toISOString()
    const lastVote = 1

    describe('GET /top', () => {
        it('should 10 of the top articles in proper format', (done) => {
            chai.request(app)
                .get('/articles/top')
                .end((err, res) => {
                    checkArticleRespone(res)
                    done()
                })
        })

        it('should have the right properties', (done) => {
            chai.request(app)
                .get('/articles/top')
                .end((err, res) => {
                    checkArticleProperties(res)
                    done()
                })
        })
    })

    describe('GET /top with querys', () => {
        it('should send next 10 articles in proper format', (done) => {
            chai.request(app)
                .get(`/articles/top?lastVote=${lastVote}&lastDate=${lastDate}`)
                .end((err, res) => {
                    checkArticleRespone(res)
                    done()
                })
        })

        it('should send next 10 articles with right properties', (done) => {
            const lastDate = new Date()
            lastDate.setDate(lastDate.getDate() - 1)
            chai.request(app)
                .get(`/articles/top?lastVote=${lastVote}&lastDate=${lastDate}`)
                .end((err, res) => {
                    checkArticleProperties(res)
                    done()
                })
        })

        it('should have votes less than lastVote and publishedAt less than lastDate', (done) => {
            chai.request(app)
                .get(`/articles/top?lastVote=${lastVote}&lastDate=${lastDate}`)
                .end((err, res) => {
                    const article = res.body[0]
                    article.votes.should.be.at.most(lastVote)
                    article.publishedAt.should.be.below(lastDate)
                    done()
                })
        })
    })
})

function checkArticleRespone(res) {
    res.should.have.status(200)
    res.body.should.be.arrary
    res.body.length.should.be.equal(10)
}

function checkArticleProperties(res) {
    const article = res.body[0]
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
