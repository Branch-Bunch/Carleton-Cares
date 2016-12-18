import React from 'react'
import Infinite from 'react-infinite'
import Article from './Article.js'
import {Grid, Row, Col} from 'react-bootstrap'
import ArticleStore from '../stores/ArticleStore.js'
import ArticleActions from '../actions/ArticleActions.js'

export default class ArticleTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            articles: [],
            sort: ArticleStore.getSort()
        }
        this.setArticles = this.setArticles.bind(this)
        this.setSort = this.setSort.bind(this)
        ArticleActions.fetchArticles(this.state.sort)
    }

    componentWillMount() {
        ArticleStore.on('articleUpdate', this.setArticles)
        ArticleStore.on('sortUpdate', this.setSort)
    }

    componentWillUnmount() {
        ArticleStore.removeListener('articleUpdate', this.setArticles)
        ArticleStore.removeListener('sortUpdate', this.setSort)
    }

    setArticles() {
        this.setState({
            articles: ArticleStore.getArticles()
        })
    }

    setSort() {
        this.setState({
            sort: ArticleStore.getSort()
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
