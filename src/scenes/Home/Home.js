import React, { Component } from 'react'
import AuthTwitter from '../../components/AuthTwitter'

const urlOauthToken = `${process.env.REACT_APP_API_POLIORAMA}/api/oauth/twitter`
const urlOauthVerify = `${process.env.REACT_APP_API_POLIORAMA}/api/oauth/twitter/verify`

class Home extends Component {
  render () {
    return (
      <div>
        <h1>POLIORAMA</h1>
        <AuthTwitter urlOauthToken={urlOauthToken} urlVerifyToken={urlOauthVerify} />
      </div>
    )
  }
}

export default Home
