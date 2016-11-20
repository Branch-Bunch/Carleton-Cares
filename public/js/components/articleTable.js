import React from 'react'
import Article from './article.js'
import {Grid, Row, Col} from 'react-bootstrap'

export default class ArticleTable extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            articles: []
        }
    }

    refreshState() {
        fetch(`articles`)
            .then(res => {
                return res.json()
            })
            .then(articles => {
                articles = articles.sort((a, b) => {
                    if (a.votes < b.votes) {
                        return 1
                    } else if (a.votes > b.votes) {
                        return -1
                    } else {
                        return 0
                    }
                })
                console.log('refresh')
                this.setState({
                    articles
                })
            })
            .catch(err => {
                console.log('Error fetching articles', err)
            })
    }

    componentDidMount() {
        this.refreshState()
    }

    render() {
        const articles = this.state.articles.map((article, index) => {
            return (
                <Article
                    key={index}
                    id={article._id}
                    index={index}
                    author={article.author}
                    title={article.title}
                    url={article.url}
                    votes={article.votes}
                    publishedAt={article.publishedAt}
                    handleVote={this.refreshState.bind(this)}
                />
            )
        })

        return (
            <Grid>
                <Row>
                    <Col md={1} mdOffset={1}><h3>Number</h3></Col>
                    <Col md={5}><h3>Article</h3></Col>
                </Row>
                <Row>
                    {articles}
                </Row>
            </Grid>
        )
    }
}
