import React from 'react'
import {render} from 'react-dom'
import {Chart} from 'react-google-charts'

export default class Graph extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            votes: []
        }
    }

    componentDidMount() {
        // TODO: Use actuial data
        /*
        fetch(`keywords/trump`)
            .then(res => res.json())
            .then((dataPoints) => {
                dataPoints = dataPoints
                    .sort((a, b) => a.times - b.times)
                    .map(point => [point.time, point.sum])
				dataPoints.unshift(['Time', words[0].word])
                this.setState({
                    dataPoints
                })
            })
            .catch(err => console.log('Error fetching articles', err))
            */
    }

  render() {
		console.log(this.state.votes)
		return (
			<div>
                <Chart
                  chartType="AreaChart"
                  data={this.state.votes}
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
