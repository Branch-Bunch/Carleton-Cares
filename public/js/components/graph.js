import React from 'react'
import ArticleTable from './articleTable.js'
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
        fetch(`keywords/trump`)
            .then(res => {
                return res.json()
            })
            .then(dataPoints => {
                dataPoints = dataPoints.sort((a, b) => {
                    if (a.time > b.time) {
                        return 1
                    } else if (a.time < b.time) {
                        return -1
                    } else {
                        return 0
                    }
                }).map(point => [point.time, point.vote])
                console.log(dataPoints)
                this.setState({
                    dataPoints
                })
            })
            .catch(err => {
                console.log('Error fetching articles', err)
            })
    }

  render() {
        return (
            <div>
                <Chart
                  chartType="AreaChart"

                  data={[['Time', 'Popularity'], this.state.dataPoints]}
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
