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
        // TODO: Use actuial data
        fetch(`keywords/trump`)
            .then(res => res.json())
            .then((dataPoints) => {
                dataPoints = dataPoints
                    .sort((a, b) => a.times - b.times)
                    .map(point => [point.time, point.sum])
                console.log(dataPoints)
                this.setState({
                    dataPoints
                })
            })
            .catch(err => console.log('Error fetching articles', err))
    }

  render() {
        return (
            <div>
                <Chart
                  chartType="AreaChart"
                  //data={[['Time', 'Popularity'], this.state.dataPoints]}
                  data={[['Time', 'Trump'], [1479651190606, 0], [1479651190706, 1], [1479651190806, 2], [1479651190906, 3], [1479651191006, 2]]}
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
