import dispatcher from '../dispatcher.js'
import ActionTypes from '../constants/ActionTypes.js'

export default class GraphActions{
    static graphArticle(id) {
        fetch(`articles/${id}`)
            .then(res => res.json())
            .then(article => article.keywords[0])
            .then(word => this.updateGraph(word))
    }

    static graphTop() {
        this.updateGraph('top')
    }

    static updateGraph(word) {
        return fetch(`keywords/${word}`)
            .then(res => res.json())
            .then(keyword => {
                const dataPoints = keyword[0].votes.map(
                    vote => [vote.time, vote.sum]
                )
                dataPoints.unshift(['Time', keyword[0].word])
                return dataPoints
            })
            .then(dataPoints => {
                dispatcher.dispatch({
                    type: ActionTypes.UPDATE_GRAPH,
                    dataPoints
                })
            })
            .catch(err => {
                console.log('Error fetching articles', err)
                reject(err)
            })
    }
}
