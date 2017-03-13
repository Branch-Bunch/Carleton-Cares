import React from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import ArticleActions from '../actions/ArticleActions'

export default class SortingBar extends React.Component {

  static changeSort(sort) {
    ArticleActions.changeSort(sort)
    ArticleActions.fetchArticles(sort)
  }

  constructor() {
    super()
    this.state = {
      newActive: null,
      topActive: null,
    }
  }

  setNewActive() {
    this.setState({ newActive: true, topActive: null })
  }

  setTopActive() {
    this.setState({ newActive: null, topActive: true })
  }

  render() {
    return (
      <ButtonGroup>
        <Button
          onClick={() => { SortingBar.changeSort('NEW'); this.setNewActive() }}
          bsStyle="info"
          bsSize="small"
          active={this.state.newActive}
        >Newest</Button>
        <Button
          onClick={() => { SortingBar.changeSort('TOP'); this.setTopActive() }}
          bsStyle="info"
          bsSize="small"
          active={this.state.topActive}
        >Top</Button>
        <Button
          onClick={() => alert('Trending is not avaiable yet')}
          bsStyle="info"
          bsSize="small"
        >Trending</Button>
      </ButtonGroup>
    )
  }
}
