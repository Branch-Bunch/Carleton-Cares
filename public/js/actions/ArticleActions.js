import dispatcher from '../dispatcher.js'

export default class ArticleActions {
    // TODO: Have different fetch calls for top/hot articles
    static fetchArticles() {
        return new Promise((resolve, reject) => {
            fetch(`articles`)
                .then(res => res.json())
                .then((articles) => {
                    articles = articles.sort((a, b) => b.votes - a.votes)
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
            .then(res => resolve(res))
            .catch((err) => {
                console.log('Vote failed to respond')
                reject(err)
            })
        })
    }
} 
