const mongoose = require('mongoose')
const Schema = mongoose.Schema

const headlineSchema = new Schema({
    author: { type: String },
    title: { type: String, required: true },
	description: { type: String, required: true },
	url: { type: String, required: true },
    urlToImage: { type: String }
    votes: { type: Number, required: true },
    publishedAt: { type: String }
})

const Headline = mongoose.model('Headline', headlineSchema, 'Headline')

module.exports = Headline
