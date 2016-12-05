import React from 'react'
import {Button, ButtonToolbar} from 'react-bootstrap'


export default class ArticleAction extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            clicked: false
        }
        this.callVote.bind(this)
        this.notReady.bind(this)
    }

    callVote(vote) {
        // TODO: Check if this return needs a semi colon
        if (!canVote()) return
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

    canVote() {
        if (!this.state.clicked) return false
        toggleButton()
        setTimeout(() => toggleButton(), 10000)
        return true
    }

    toggleButton() {
        this.setState({
            clicked: !clicked
        })
    }

    // Temp function
    notReady() {
        alert('Graphs aren\'t avaiable yet!')
    }

    render() {
        // TODO: Try to callVote without function invocing
        return (
            <ButtonToolbar>
                <Button onClick={() => this.callVote(1)} bsStyle="success" bsSize="small">+</Button>
                <Button onClick={() => this.callVote(-1)} bsStyle="danger" bsSize="small">-</Button>
                <Button onClick={this.notReady} bsSize="small">Show Trend</Button>
            </ButtonToolbar>
        )
    }
}
