import React, { Component } from 'react'
import AuthTwitter from '../../components/AuthTwitter/AuthTwitter'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setUser } from '../../store/modules/user'
import jwtDecode from 'jwt-decode'
import EnrichedGrafh from "../../components/EnrichedGraph/EnrichedGrafh";

const urlOauthToken = `${process.env.REACT_APP_API_POLIORAMA}/oauth/twitter`
const urlOauthVerify = `${process.env.REACT_APP_API_POLIORAMA}/oauth/twitter`

class Home extends Component {
  constructor (props) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)
  }

  handleLogin (data) {
    console.log('handle login', data)
    const user = jwtDecode(data.token)
    console.log(user)
    this.props.actions.setUser(user)
  }

  render () {
    return (
      <div>
        <h1 style={{position: 'absolute'}}>POLIORAMA</h1>
        <div style={{ position: 'absolute', right: '20px', top: '10px' }}>
          <AuthTwitter
            endpointOauthToken={{ method: 'GET', url: urlOauthToken }}
            endpointVerifyToken={{ method: 'POST', url: urlOauthVerify }}
            onFailure={(res) => console.log(res)}
            onSuccess={this.handleLogin}
          />
        </div>
        <EnrichedGrafh />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: state.user
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ setUser }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
