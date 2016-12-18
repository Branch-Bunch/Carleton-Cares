import dispatcher from '../dispatcher.js'

export default class ArticleActions {

    static fetchArticles(sort, lastArticle) {
        return new Promise((resolve, reject) => {

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
                    break
                }
            }

            fetch(fetchURL)
                .then(res => res.json())
                .then((articles) => {
                    console.log(articles)
                    dispatcher.dispatch({
                        articles,
                        type: 'UPDATE_ARTICLES'
                    })
                    resolve()
                })
                .catch((err) =>  {
                    console.log('Error fetching articles', err)
                    reject(err)
                })
        })
    }

    static postVote(vote, id) {
        return new Promise((resolve, reject) => {
            fetch('articles/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    vote,
                    id
                })
            })
            // TODO: Could add a dispatch here if need post vote info
                .then(res => resolve(res.json()))
                .catch((err) => {
                    console.log('Vote failed to respond')
                    reject(err)
                })
        })
    }
} 
