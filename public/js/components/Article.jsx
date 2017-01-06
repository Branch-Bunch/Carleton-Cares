import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import ArticleButtons from './ArticleButtons'

export default function Article(props) {
  return (
    <Grid>
      <Row>
        <Col md={1} mdOffset={1}>
          {props.index}
        </Col>
        <Col md={5}>
          <a href={props.url}>{props.title}</a>
        </Col>
        <Col md={5}>
          <ArticleButtons
            id={props._id}
          />
        </Col>
      </Row>
      <Row>
        <Col md={1} mdOffset={2}>
          Votes: {props.votes}
        </Col>
        <Col md={3}>
          posted by: {props.author}
        </Col>
        <Col md={4}>
          at: {new Date(props.publishedAt).toLocaleDateString()}
        </Col>
      </Row>
    </Grid>
  )
}

Article.propTypes = {
  index: React.PropTypes.number.isRequired,
  url: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  _id: React.PropTypes.string.isRequired,
  votes: React.PropTypes.number.isRequired,
  author: React.PropTypes.string.isRequired,
  publishedAt: React.PropTypes.string.isRequired,
}
