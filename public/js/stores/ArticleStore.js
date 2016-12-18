import { EventEmitter } from 'events'
import dispatcher from '../dispatcher.js'

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
        return this.articles[articles.length - 1]
    }

    getSort() {
        return this.sort
    }

    handleAction(action) {
        switch(action.type) {
            case 'UPDATE_ARTICLES': {
                this.articles = action.articles 
                this.emit('articleUpdate')
                break
            }
        }
    }
}

const articleStore = new ArticleStore()
dispatcher.register(articleStore.handleAction)
export default articleStore
