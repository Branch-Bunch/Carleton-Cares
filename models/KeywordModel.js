const mongoose = require('mongoose')
const Schema = mongoose.Schema

const topicSchema = new Schema({
	name: {type: String, required: true},
    title: {type: String, required: true},
	uri: {type: String, required: true},
    votes: {type: Number, required: true}
})

const Topic  = mongoose.model('Topic', topicSchema, 'Topic')

module.exports = Topic
