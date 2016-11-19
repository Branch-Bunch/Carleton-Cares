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

const Topic  = mongoose.model('Topic', topicSchema, 'Topic')

module.exports = Topic
