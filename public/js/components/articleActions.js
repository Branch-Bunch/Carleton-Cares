import React from 'react'

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
            <div>
                <button onClick={() => this.callVote(1)}>
                    +
                </button>
                <button onClick={() => this.callVote(-1)}>
                    -
                </button>
                <button>
                    Show Trend
                </button>
            </div>
        )
    }
}
