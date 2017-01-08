import React from 'react'
import {render} from 'react-dom'
import {Chart} from 'react-google-charts'
import GraphStore from '../stores/GraphStore'

export default class Graph extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataPoints: GraphStore.getDataPoints()
        }
    }

    componentDidMount() {
        GraphStore.on('graphUpdate', () => {
            this.setState({
                dataPoints: GraphStore.getDataPoints()
            })
        })
    }


    render() {
        return (
            <div>
                <Chart
                  chartType="AreaChart"
                  data={this.state.dataPoints}
				  options={{}}
                  graph_id="ScatterChart"
                  width="100%"
                  height="400px"
                  legend_toggle
                 />
            </div>
        )
    }
}
