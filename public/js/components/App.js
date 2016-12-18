import React from 'react'
import Infinite from 'react-infinite'
import ArticleTable from './ArticleTable.js'
import Graph from './Graph.js'
import ArticleActions from '../actions/ArticleActions.js'

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
