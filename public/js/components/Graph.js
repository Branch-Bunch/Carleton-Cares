import React from 'react'
import {render} from 'react-dom'
import {Chart} from 'react-google-charts'

export default class Graph extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataPoints: []
        }
    }

    componentDidMount() {
        fetch(`keywords/top`)
            .then(res => {
                return res.json()
            })
            .then(dataPoints => {
				console.log(dataPoints.words[0])
					/*
                dataPoints.words[0] = dataPoints
                    .sort((a, b) => a - b)
                    .map(point => [point.time, point.sum])
                console.log(dataPoints)
                this.setState({
                    dataPoints
                })
				*/
            })
            .catch(err => console.log('Error fetching articles', err))
    }

  render() {
        this.state.dataPoints.splice(0, 0, ['Time', 'Trump'])
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
