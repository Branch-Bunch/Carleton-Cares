import React from 'react'
import PostAction from './postActions.js'

export default class Post extends React.Component {
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
                        <PostAction />
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
