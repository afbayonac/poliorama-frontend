import React, { Component } from 'react'
import AuthTwitter from '../../components/AuthTwitter'

const urlOauthToken = 'http://localhost:5000/api/oauth/twitter'
const urlOauthVerify = 'http://localhost:5000/api/oauth/twitter/verify'

class Home extends Component{
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
