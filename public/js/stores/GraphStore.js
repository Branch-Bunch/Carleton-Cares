import { EventEmitter } from 'events'
import dispatcher from '../dispatcher'
import ActionTypes from '../constants/ActionTypes'

class GraphStore extends EventEmitter {
  constructor() {
    super()
    this.points = []
  }

  setPoints(dataPoints) {
    this.points = dataPoints
    this.emit('graphUpdate')
  }


  getDataPoints() {
    return this.points
  }

  handleAction(action) {
    switch (action.type) {
      case ActionTypes.UPDATE_GRAPH: {
        this.setPoints(action.dataPoints)
        break
      }
    }
  }
}

const graphStore = new GraphStore()
dispatcher.register(graphStore.handleAction.bind(graphStore))
export default graphStore
