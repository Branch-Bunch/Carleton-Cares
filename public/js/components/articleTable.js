import React from 'react'
import Article from './article.js'

export default class ArticleTable extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            articles: []
        }
    }

    componentDidMount() {
        fetch(`articles`)
            .then(res => {
                return res.json()
            })
            .then(articles => {
                this.setState({
                    articles
                })
            })
            .catch(err => {
                console.log('Error fetching articles', err)
            })
    }

    render() {
        const articles = this.state.articles.map((article, index) => {
            return (
                <Article
                    key={index}
                    index={index}
                    author={article.author}
                    title={article.title}
                    url={article.url}
                    votes={article.votes}
                    publishedAt={article.publishedAt}
                />
            )
        })

        return (
            <table>
                <thead>
                    <tr>
                        <th>ArticleNumber</th>
                        <th>Article</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {articles}
                </tbody>
            </table>
        )
    }
}
