const mongoose = require('mongoose')
const Schema = mongoose.Schema

cost voteSchema = new Schema({
	sum: { type int, required: true },
	time: { type String, required: true }
}, {_id: false})

const keywordSchema = new Schema({
	word: { type: String, lowercase: true, required: true },
	votes: [voteSchema]
})

const Keyword = mongoose.model('Keyword', keywordSchema, 'Keyword')

module.exports = Keyword
