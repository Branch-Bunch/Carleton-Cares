import React from 'react'
import ArticleTable from './articleTable.js'
import Graph from './graph.js'

export default class App extends React.Component {
  render() {
        return (
            <div>
                <Graph />
                <ArticleTable />
            </div>
        )
    }
}
