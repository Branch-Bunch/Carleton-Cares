'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Keyword = require('../models/KeywordModel.js')

const router = express.Router()

router.get('/word/:word', (req, res) => {
    console.log(req.params)
    let word = req.params.word
    console.log(word)
    Keyword.find({word: word}).lean().then((wordList) => {
        console.log(wordList[0])
        console.log(wordList[0].votes)
        console.log(word)
        res.send(wordList[0].votes)
    }).catch((err) => {
        console.log(err)
        res.status(500).end()
    })
})

router.get('/top', (req, res) => {
	Keyword
		.find()
		.lean()
		.then((wordList) => {
			let topWords = wordList.reduce((accumulator, word) => {
				let wordSum = word.votes[word.votes.length-1].sum
				let topSum = accumulator.sum
				if (wordSum > topSum) {
					accumulator.words = [word]
					accumulator.sum = wordSum
				}
				if (wordSum === topSum) {
					accumulator.words.push(word)
				}
				return accumulator
			}, {
				sum: 0,
				words: []
			})
			console.log(topWords.words)
			res.send(topWords.words)
		})
		.catch((err) => {
			console.log(err)
			res.status(500).end()	
		})
})

module.exports = router
