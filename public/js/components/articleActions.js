import React from 'react'
import {Button,ButtonToolbar} from 'react-bootstrap'


export default class ArticleAction extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            clicked: false
        }
    }

    callVote(vote) {
        fetch('articles/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                vote,
                id: this.props.id
            })
        })
        .then(res => this.props.handleVote())
    }

    render() {
        return (
            <ButtonToolbar>
                <Button onClick={() => this.callVote(1)} bsStyle="success" bsSize="small">+</Button>
                <Button onClick={() => this.callVote(-1)} bsStyle="danger" bsSize="small">-</Button>
                <Button bsSize="small">Show Trend</Button>
            </ButtonToolbar>
        )
    }
}
