import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { AUTH_TOKEN, USER_DATA } from '../constants'

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
      user{
        id
      }
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user{
        id
      }
    }
  }
`

class Login extends Component {
  state = {
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    name: '',
    error: ''
  }

  render() {
    return (
      <div>
        <h4 className="mv3">{this.state.login ? 'Login' : 'Sign Up'}</h4>
        <div className="flex flex-column">
          {!this.state.login && (
            <input
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
              type="text"
              placeholder="Your name"
            />
          )}
          <input
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
            type="text"
            placeholder="Your email address"
          />
          <input
            value={this.state.password}
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            placeholder="Choose a safe password"
          />
        </div>
        <div className="flex mt2 red">
          {this.state.error}
        </div>
        <div className="flex mt3">
          <div className="pointer mr2 button" onClick={() => this._confirm()}>
            {this.state.login ? 'login' : 'create account'}
          </div>
          <div
            className="pointer button"
            onClick={() => this.setState({ login: !this.state.login, error: '' })}
          >
            {this.state.login
              ? 'need to create an account?'
              : 'already have an account?'}
          </div>
        </div>
      </div>
    )
  }

  _confirm = async () => {
    const { name, email, password } = this.state
    try{
      if (this.state.login) {
        const result = await this.props.loginMutation({
          variables: {
            email,
            password,
          }
        })
        this._saveUserData(result.data.login)
      } else {
        const result = await this.props.signupMutation({
          variables: {
            name,
            email,
            password,
          },
        })  
        this._saveUserData(result.data.signup)
      }
      this.props.history.push(`/`)
    }catch(e){
      if(e.graphQLErrors){
        const error = e.graphQLErrors[0]
        console.log(error)
        this.setState({error: error.message})
      }
    }
    
  }

  _saveUserData = ({token, user}) => {
    localStorage.setItem(AUTH_TOKEN, token)
    localStorage.setItem(USER_DATA, JSON.stringify(user))
  }
}

export default compose(
    graphql(SIGNUP_MUTATION, { name: 'signupMutation' }),
    graphql(LOGIN_MUTATION, { name: 'loginMutation' }),
)(Login)