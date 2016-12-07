import { EventEmitter } from 'events'
import dispatcher from '../dispatcher.js'

class ArticleStore extends EventEmitter {
    constructor() {
        super()
        this.articles = []
        this.handleAction = this.handleAction.bind(this)
    }

    getArticles() {
        return this.articles
    }

    handleAction(action) {
        switch(action.type) {
            case 'UPDATE_ARTICLES': {
                this.articles = action.articles 
                this.emit('update')
                break
            }
        }
    }
}

const articleStore = new ArticleStore()
dispatcher.register(articleStore.handleAction)
export default articleStore
