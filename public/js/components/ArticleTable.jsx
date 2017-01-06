import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import Article from './Article'
import SortingBar from './SortingBar'
import ArticleStore from '../stores/ArticleStore'
import ArticleActions from '../actions/ArticleActions'

export default class ArticleTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      articles: [],
      sort: ArticleStore.getSort(),
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
      articles: ArticleStore.getArticles(),
    })
  }

  setSort() {
    this.setState({
      sort: ArticleStore.getSort(),
    })
  }

  render() {
    const articles = this.state.articles.map((article, index) => (
      <Article
        {...article}
        key={article._id}
        index={index + 1}
      />
    ))

    // TODO: Find a better way to center the SortingBar
    return (
      <Grid>
        <Row>
          <Col mdOffset={5}>
            <SortingBar />
          </Col>
        </Row>
        <Row>
          <Col md={1} mdOffset={1}>
            <h3>#</h3>
          </Col>
          <Col md={5}>
            <h3>{this.state.sort} Articles</h3>
          </Col>
        </Row>
        <Row>
          {articles}
        </Row>
      </Grid>
    )
  }
}
