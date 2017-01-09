import { EventEmitter } from 'events'
import dispatcher from '../dispatcher.js'
import ActionTypes from '../constants/ActionTypes.js'

class GraphStore extends EventEmitter {
    constructor() {
        super()
        this.points = [['TempData', 'TempData'], [1,1]]
    }

    setPoints(dataPoints) {
        this.points = dataPoints
        this.emit('graphUpdate')
    }


    getDataPoints() {
        return this.points
    }

    handleAction(action){
        switch (action.type) {
            case 'UPDATE_GRAPH':
                this.setPoints(action.dataPoints)
                break;
        }
    }
}

const graphStore = new GraphStore()
dispatcher.register(graphStore.handleAction.bind(graphStore))
export default graphStore
