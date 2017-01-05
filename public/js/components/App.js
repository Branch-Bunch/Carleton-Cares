import React from 'react'
import ArticleTable from './ArticleTable.js'
import Graph from './Graph.js'

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
