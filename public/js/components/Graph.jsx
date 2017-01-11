import React from 'react'
import { Chart } from 'react-google-charts'
import GraphStore from '../stores/GraphStore'
import GraphActions from '../actions/GraphActions'

export default class Graph extends React.Component {
  constructor(props) {
    super(props)
    GraphActions.graphTop()
    this.state = {
      dataPoints: GraphStore.getDataPoints(),
    }
    this.setDataPoints = this.setDataPoints.bind(this)
  }

  componentWillMount() {
    GraphStore.on('graphUpdate', this.setDataPoints)
  }

  componentWillUnmount() {
    GraphStore.removeListener('graphUpdate', this.setDataPoints)
  }

  setDataPoints() {
    this.setState({ dataPoints: GraphStore.getDataPoints() })
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
