/* eslint-disable indent */
import React, { Component } from 'react'
import jwtDecode from 'jwt-decode'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropsTypes from 'prop-types'

import AuthTwitter from '../../components/AuthTwitter/AuthTwitter'
import { setUser } from '../../store/modules/user'
import fetchGraph from '../../store/fetchGraph'
import EnrichedGrafh from '../../components/EnrichedGraph/EnrichedGrafh'

const urlOauthToken = `${process.env.REACT_APP_API_POLIORAMA}/oauth/twitter`
const urlOauthVerify = `${process.env.REACT_APP_API_POLIORAMA}/oauth/twitter`

class Home extends Component {
  state = { width: window.innerWidth, height: window.innerHeight }
  constructor (props) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)
  }

  handleLogin (data) {
    const user = jwtDecode(data.token)
    this.props.actions.setUser(user)
  }

  componentDidMount () {
    window.addEventListener('resize', () => this.setState({ width: window.innerWidth, height: window.innerHeight }))
    this.props.actions.fetchGraph()
  }

  render () {
    return (
      <div>
        <h1 style={{ position: 'absolute' }}>POLIORAMA</h1>
        <div style={{ position: 'absolute' }}>
          {this.props.graph.populated
            ? <EnrichedGrafh width={this.state.width} height={this.state.height} graph={this.props.graph} />
            : <div>wait</div>}
        </div>
        <div style={{ position: 'absolute', right: '20px', top: '10px' }}>
          { !this.props.user.login
           ? <AuthTwitter
            endpointOauthToken={{ method: 'GET', url: urlOauthToken }}
            endpointVerifyToken={{ method: 'POST', url: urlOauthVerify }}
            onFailure={(res) => console.log(res)}
            onSuccess={this.handleLogin}
          />
          : <div>{this.props.user.screenName}</div>
          }
        </div>
        {this.props.perimeters.selected
          ? <div>{this.props.perimeters.select.name}</div>
          : ''}
      </div>
    )
  }
}

Home.propsTypes = {
  actions: PropsTypes.shape({
    fetchGraph: PropsTypes.func
  })
}

function mapStateToProps (state) {
  return {
    user: state.user,
    graph: state.graph,
    perimeters: state.perimeters
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ setUser, fetchGraph }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
