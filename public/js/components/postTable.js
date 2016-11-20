import React from 'react'
import Post from './post.js'

export default class PostTable extends React.Component {
    render() {
        const posts = this.props.posts.map((post, index) => {
            return (
                <Post 
                    key={index}
                    index={index}
                    author={post.author}
                    title={post.title}
                    url={post.url}
                    votes={post.votes}
                    publishedAt={post.publishedAt}
                />
            )
        })

        return (
            <table>
                <thead>
                    <tr>
                        <th>Post #</th>
                        <th>Post Article</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {posts}
                </tbody>
            </table>
        )
    }
}
