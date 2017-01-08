import dispatcher from '../dispatcher.js'
import ActionTypes from '../constants/ActionTypes.js'

export default class GraphActions{
    static updateGraph(id){
        //const word = 'panda'
        fetch(`articles/${id}`)
            .then(res => res.json())
            .then(article => article.keywords[0])
            .then( word => {
                fetch(`keywords/${word}`)
                    .then(res => res.json())
                    .then(votes =>{
                        console.log(votes)
                        const dataPoints = votes.map(
                            vote => [vote.time, vote.sum]
                        )
                        dataPoints.unshift(['Time', word])
                        return dataPoints
                    })
                    .then( dataPoints => {
                        dispatcher.dispatch({
                            type: ActionTypes.UPDATE_GRAPH,
                            dataPoints
                        })
                    })
                    .catch(err => console.log('Error fetching articles', err))
            }
        )
    }
}
