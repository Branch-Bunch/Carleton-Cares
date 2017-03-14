import dispatcher from '../dispatcher'
import ActionTypes from '../constants/ActionTypes'

export default class GraphActions {
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
    fetch(`keywords/${word}`)
      .then(res => res.json())
      .then((keyword) => {
        const dataPoints = keyword[0].votes.map(
        vote => [new Date(parseInt(vote.time, 10)).toDateString(), vote.sum],
        )
        dataPoints.unshift(['Time', keyword[0].word])
        dispatcher.dispatch({
          type: ActionTypes.UPDATE_GRAPH,
          dataPoints,
        })
      })
      .catch(err => err)
  }
}
