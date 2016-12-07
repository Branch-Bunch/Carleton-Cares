import React from 'react'
import Article from './Article.js'
import {Grid, Row, Col} from 'react-bootstrap'
import ArticleStore from '../stores/ArticleStore.js'
import ArticleActions from '../actions/ArticleActions.js'

export default class ArticleTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            articles: []
        }
        this.setArticles = this.setArticles.bind(this)
        ArticleActions.fetchArticles()
    }

    componentWillMount() {
        ArticleStore.on('update', this.setArticles)
    }

    componentWillUnmount() {
        ArticleStore.removeListener('update', this.setArticles)
    }

    setArticles() {
        this.setState({
            articles: ArticleStore.getArticles()
        })
    }

    render() {
        const articles = this.state.articles.map((article, index) => {
            return (
                <Article
                    {...article} 
                    key={article._id}
                    index={index + 1}
                    //handleVote={this.refreshState}
                />
            )
        })

        //TODO: Try bootstrap componets without {}'s
        return (
            <Grid>
                <Row>
                    <Col md={1} mdOffset={1}>
                        <h3>Number</h3>
                     </Col>
                     <Col md={5}>
                         <h3>Article</h3>
                     </Col>
                </Row>
                <Row>
                    {articles}
                </Row>
            </Grid>
        )
    }
}
