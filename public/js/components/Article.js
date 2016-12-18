import React from 'react'
import ArticleButtons from './ArticleButtons.js'
import {Grid, Row, Col} from 'react-bootstrap'

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
                            handleVote={this.props.handleVote}
                            id={this.props._id}
                        />
                     </Col>
                </Row>
                <Row>
                    <Col md={1} mdOffset={4}>
                        Votes: {this.props.votes}
                     </Col>
                     <Col md={2}>
                         posted by: {this.props.author}
                     </Col>
                     <Col md={3}>
                         at: {new Date(this.props.publishedAt).toLocaleDateString()}
                     </Col>
                </Row>
            </Grid>
        )
    }
}
