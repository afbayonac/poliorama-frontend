import React, { Component } from 'react'
import AuthTwitter from '../../components/AuthTwitter'

const urlOauthToken = `${process.env.REACT_APP_API_POLIORAMA}/oauth/twitter`
const urlOauthVerify = `${process.env.REACT_APP_API_POLIORAMA}/oauth/twitter`

class Home extends Component {
  render () {
    return (
      <div>
        <h1>POLIORAMA</h1>
        <AuthTwitter
          endpointOauthToken={{ method: 'GET', url: urlOauthToken }}
          endpointVerifyToken={{ method: 'POST', url: urlOauthVerify }}
          onFailure={(res) => console.log(res)}
          onSuccess={(res) => console.log(res)}
        />
      </div>
    )
  }
}

export default Home
