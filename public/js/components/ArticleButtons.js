import React from 'react'
import { Button, ButtonToolbar } from 'react-bootstrap'
import ArticleActions from '../actions/ArticleActions.js'
import ArticleStore from '../stores/ArticleStore.js'

export default class ArticleButtons extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            clicked: false
        }
        this.toggleButton = this.toggleButton.bind(this)
    }

    callVote(vote) {
        if (!this.canVote()) return 
        ArticleActions.postVote(vote, this.props.id)
            .then(() => ArticleActions.fetchArticles(ArticleStore.getSort()))
    }

    canVote() {
        if (this.state.clicked) return false
        this.toggleButton()
        setTimeout(this.toggleButton, 10000)
        return true
    }

    toggleButton() {
        this.setState((prevState) => ({
            clicked: !prevState.clicked
        }))
    }

    // Temp function
    notReady() {
        alert('Graphs aren\'t avaiable yet!')
    }

    render() {
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
