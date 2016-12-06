import React from 'react'
import {Button, ButtonToolbar} from 'react-bootstrap'


export default class ArticleAction extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            clicked: false
        }
        this.notReady.bind(this)
    }

    callVote(vote) {
        // TODO: Check if this return needs a semi colon
        if (!this.canVote()) return null
        fetch('articles/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                vote,
                id: this.props._id
            })
        })
        .then(res => this.props.handleVote())
        .catch(err => console.log('Vote failed to respond'))
    }

    canVote() {
        if (this.state.clicked) return false
        this.toggleButton()
        setTimeout(() => this.toggleButton(), 10000)
        return true
    }

    toggleButton() {
        const clicked = !this.state.clicked
        this.setState({
            clicked
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
                <Button
                    onClick={() => this.callVote(1)}
                    disabled={this.state.clicked}
                    bsStyle="success"
                    bsSize="small"
                >+</Button>

                <Button
                    onClick={() => this.callVote(-1)}
                    disabled={this.state.clicked}
                    bsStyle="danger"
                    bsSize="small"
                >-</Button>

                <Button
                    onClick={this.notReady}
                    bsSize="small"
                >Show Trend</Button>
            </ButtonToolbar>
        )
    }
}
