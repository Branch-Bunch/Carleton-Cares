import React from 'react'
import ArticleAction from './articleActions.js'

export default class Article extends React.Component {
    render() {
        return (
            <div>
                <tr>
                    <td>
                        {this.props.index + 1}
                    </td>
                    <td>
                        {this.props.title}
                    </td>
                    <td>
                        <ArticleAction />
                    </td>
                </tr>
                <tr>
                    <td>
                        Votes: {this.props.votes}
                    </td>
                    <td>
                        posted by: {this.props.author}
                    </td>
                    <td>
                        at: {this.props.publishedAt}
                    </td>
                </tr>
            </div>
        )
    }
}
