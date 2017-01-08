const chai = require ('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
const app = require('../server.js')

chai.use(chaiHttp)

describe('/keywords Route', () => {
    describe('GET /keywords/top', () => {
        it('response should not be empty', (done) => {
            chai.request(app)
                .get('/keywords/top')
                .end((err, res) => {
                    checkReponse(res)
					checkVotes(res)
                    done()
                })
        })
    })
})

function checkReponse(res) {
    res.should.have.status(200)
    res.body.should.be.array
    res.body.should.not.be.empty
}

function checkVotes(res) {
	res.body.forEach(element => {
		element.word.should.be.string
		element.word.should.not.be.empty
		element.votes.should.be.arrary
	})
}
