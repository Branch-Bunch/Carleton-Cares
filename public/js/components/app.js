import React from 'react'
import ArticleTable from './articleTable.js'

export default class App extends React.Component {
    render() {
        return (
            <div>
                <h1>Carleton Cares</h1>
                <ArticleTable />
            </div>
        )
    }
}
