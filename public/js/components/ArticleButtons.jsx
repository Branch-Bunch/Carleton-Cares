import React from 'react'
import { Button, ButtonToolbar } from 'react-bootstrap'
import ArticleActions from '../actions/ArticleActions'
import ArticleStore from '../stores/ArticleStore'
import GraphActions from '../actions/GraphActions'

export default class ArticleButtons extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      clicked: false,
    }
    this.toggleButton = this.toggleButton.bind(this)
    this.updateGraph = this.updateGraph.bind(this)
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  callVote(vote) {
    if (!this.canVote()) return
    ArticleActions.postVote(vote, this.props.id)
      .then(() => ArticleActions.fetchArticles(ArticleStore.getSort()))
  }

  canVote() {
    if (this.state.clicked) return false
    this.toggleButton()
    this.timeout = setTimeout(this.toggleButton, 10000)
    return true
  }

  toggleButton() {
    this.setState(prevState => ({
      clicked: !prevState.clicked,
    }))
  }

  updateGraph() {
    GraphActions.graphArticle(this.props.id)
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
          onClick={this.updateGraph}
          bsSize="small"
        >Show Trend</Button>
      </ButtonToolbar>
    )
  }
}

ArticleButtons.propTypes = {
  id: React.PropTypes.string.isRequired,
}
