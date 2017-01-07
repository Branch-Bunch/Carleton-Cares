import React from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import ArticleActions from '../actions/ArticleActions'

export default class SortingBar extends React.Component {

  static changeSort(sort) {
    ArticleActions.changeSort(sort)
    ArticleActions.fetchArticles(sort)
  }

  render() {
    return (
      <ButtonGroup>
        <Button
          onClick={() => SortingBar.changeSort('NEW')}
          bsStyle="info"
          bsSize="small"
        >Newest</Button>
        <Button
          onClick={() => SortingBar.changeSort('TOP')}
          bsStyle="info"
          bsSize="small"
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
