import dispatcher from '../dispatcher.js'
import ActionTypes from '../constants/ActionTypes.js'

export default class ArticleActions {

    static fetchArticles(sort, lastArticle) {
        return new Promise((resolve, reject) => {

<<<<<<< HEAD
            let fetchURL = 'articles'
            const lastDate = (lastArticle) ? lastArticle.publishedAt: null
            const lastVote = (lastArticle) ? lastArticle.votes: null

            switch(sort) {
                case 'NEW': {
                    fetchURL += '/new'
                    if (lastDate) {
                        fetchURL += `?lastDate=${lastDate}`
                    }
                    break
                }
                case 'TOP': {
                    fetchURL += '/top'
                    if (lastDate && lastVote) {
                        fetchURL += `?lastVote=${lastVote}&lastDate=${lastDate}`
                    }
=======
            let fetchURL = 'articles/'
            const lastDate = (lastArticle) ? lastArticle.publishedAt: null

            switch(sort) {
                case 'NEW': {
                    fetchURL += `new?lastDate=${lastDate}`
                    break
                }
                case 'TOP': {
                    const lastVote = (lastArticle) ? lastArticle.votes: null
                    fetchURL += `top?lastVote=${lastVote}&lastDate=${lastDate}`
>>>>>>> Refactored fecthing articles to get sorted articles,
                    break
                }
            }

            fetch(fetchURL)
                .then(res => res.json())
                .then((articles) => {
<<<<<<< HEAD
=======
                    console.log(articles)
>>>>>>> Refactored fecthing articles to get sorted articles,
                    dispatcher.dispatch({
                        articles,
                        type: ActionTypes.UPDATE_ARTICLES 
                    })
                    resolve()
                })
                .catch((err) =>  {
                    console.log('Error fetching articles', err)
                    reject(err)
                })
        })
    }

    static changeSort(sort) {
        dispatcher.dispatch({
            sort,
            type: ActionTypes.UPDATE_SORT 
        })
    }

    static postVote(vote, id) {
        return new Promise((resolve, reject) => {
            fetch('articles/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vote,
                    id
                })
            })
            // TODO: Could add a dispatch here if need post vote info
                .then(res => resolve(res.json()))
                .catch((err) => {
<<<<<<< HEAD
                    console.log('Vote failed to respond', err)
=======
                    console.log('Vote failed to respond')
>>>>>>> Refactored fecthing articles to get sorted articles,
                    reject(err)
                })
        })
    }
} 
