const chai = require ('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
const app = require('../server.js')

chai.use(chaiHttp)

describe('/articles', () => {
    describe('GET /top', () => {
        it('should respond with proper status', (done) => {
            chai.request(app)
                .get('/articles')
                .then((res) => {
                    res.should.have.status(200)
                    done()
                })
        })
        it('should get 10 of the top articles', (done) => {
            chai.request(app)
                .get('/articles/top')
                .then((res) => {
                    res.body.should.be.arrary
                    res.body.lenght.should.be.eql(10)
                })
        })
        it('should have the right properties')
        it('should send next 10 articles')
    })
})
