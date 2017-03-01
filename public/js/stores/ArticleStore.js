import { EventEmitter } from 'events'
import dispatcher from '../dispatcher'
import ActionTypes from '../constants/ActionTypes'

class ArticleStore extends EventEmitter {
  constructor() {
    super()
    this.articles = []
    this.sort = 'NEW'
    this.handleAction = this.handleAction.bind(this)
  }

  getArticles() {
    return this.articles
  }

  getLastArticle() {
    return this.articles[this.articles.length - 1]
  }

  getSort() {
    return this.sort
  }

  handleAction(action) {
    switch (action.type) {

      case ActionTypes.ADD_ARTICLES: {
        this.articles.push(...action.articles)
        this.emit('articleUpdate')
        break
      }

      case ActionTypes.UPDATE_ARTICLES: {
        this.articles = action.articles
        this.emit('articleUpdate')
        break
      }

      case ActionTypes.UPDATE_VOTE: {
        const updateArticle = this.articles.find(article => article.id === action.article.id)
        updateArticle.votes += 1
        console.log(updateArticle)
        this.emit('articleUpdate')
        break
      }

      case ActionTypes.UPDATE_SORT: {
        this.sort = action.sort
        this.emit('sortUpdate')
        break
      }
    }
  }
}

const articleStore = new ArticleStore()
dispatcher.register(articleStore.handleAction)
export default articleStore
