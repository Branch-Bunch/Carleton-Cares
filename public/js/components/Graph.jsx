import React from 'react'
import { Chart } from 'react-google-charts'

export default class Graph extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataPoints: [],
    }
  }

    componentDidMount() {
        fetch(`keywords/top`)
            .then(res => res.json())
            .then(words => {
                const dataPoints = words[0].votes
                    .map(point => [point.time, point.sum])
				dataPoints.unshift(['Time', words[0].word])
                this.setState({ dataPoints })
            })
            .catch(err => console.log('Error fetching articles', err))
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
