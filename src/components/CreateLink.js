import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { FEED_QUERY } from './LinkList'
import { LINKS_PER_PAGE } from '../constants'

const POST_LINK_MUTATION = gql`
  mutation PostLinkMutation($description: String!, $url: String!) {
    postLink(data: {
      description: $description, 
      url: $url
    }) {
      id
      createdAt
      url
      description
    }
  }
`

class CreateLink extends Component {
  state = {
    description: '',
    url: '',
  }

  render() {
    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={this.state.description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={this.state.url}
            onChange={e => this.setState({ url: e.target.value })}
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <button onClick={() => this._createLink()}>Submit</button>
      </div>
    )
  }

  _createLink = async () => {
    const { description, url } = this.state
    await this.props.postLinkMutation({
      variables: {
        description,
        url,
      },
      update: (store, { data: { postLink } }) => {
        const first = LINKS_PER_PAGE
        const skip = 0
        const orderBy = 'createdAt_DESC'
        const data = store.readQuery({
          query: FEED_QUERY,
          variables: { first, skip, orderBy },
        })
        data.feed.links.splice(0, 0, postLink)
        data.feed.links.pop()
        store.writeQuery({
          query: FEED_QUERY,
          data,
          variables: { first, skip, orderBy },
        })
      },
    })
    this.props.history.push(`/new/1`)
  }
}

export default graphql(POST_LINK_MUTATION, { name: 'postLinkMutation' })(CreateLink)