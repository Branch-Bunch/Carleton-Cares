const mongoose = require('mongoose')
const Schema = mongoose.Schema

const voteSchema = new Schema({
    sum: { type: Number, required: true },
	time: { type: String, required: true }
}, {_id: false})

const keywordSchema = new Schema({
	word: { type: String, lowercase: true, required: true },
	votes: [voteSchema]
})

const Keyword = mongoose.model('Keyword', keywordSchema, 'Keyword')

module.exports = Keyword
