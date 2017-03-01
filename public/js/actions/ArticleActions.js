import dispatcher from '../dispatcher'
import ActionTypes from '../constants/ActionTypes'

export default class ArticleActions {

  static fetchArticles(sort, lastArticle) {
    let fetchURL = 'articles'
    const lastDate = (lastArticle) ? lastArticle.publishedAt : null
    const lastVote = (lastArticle) ? lastArticle.votes : null

    switch (sort) {
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
        break
      }
    }

    fetch(fetchURL)
      .then(res => res.json())
      .then((articles) => {
        dispatcher.dispatch({
          articles,
          type: (lastArticle) ? ActionTypes.ADD_ARTICLES : ActionTypes.UPDATE_ARTICLES,
        })
      })
      .catch(err => console.log(err))
  }

  static changeSort(sort) {
    dispatcher.dispatch({
      sort,
      type: ActionTypes.UPDATE_SORT,
    })
  }

  static postVote(vote, id) {
    fetch('articles/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vote, id }),
    })
      .then(res => res.json())
      .then((article) => {
        console.log(article)
        dispatcher.dispatch({
          article,
          type: ActionTypes.UPDATE_VOTE,
        })
      })
      .catch(err => console.log(err))
  }
}
