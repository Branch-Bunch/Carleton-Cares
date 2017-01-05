import React from 'react'
import ArticleButtons from './ArticleButtons.js'
import { Grid, Row, Col } from 'react-bootstrap'

export default class Article extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col md={1} mdOffset={1}>
            {this.props.index}
          </Col>
          <Col md={5}>
            <a href={this.props.url}>{this.props.title}</a>
          </Col>
          <Col md={5}>
            <ArticleButtons
              id={this.props._id}
            />
          </Col>
        </Row>
        <Row>
          <Col md={1} mdOffset={2}>
                        Votes: {this.props.votes}
          </Col>
          <Col md={3}>
                         posted by: {this.props.author}
          </Col>
          <Col md={4}>
                         at: {new Date(this.props.publishedAt).toLocaleDateString()}
          </Col>
        </Row>
      </Grid>
    )
  }
}
