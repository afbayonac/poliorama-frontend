/* eslint-disable indent */
import React, { Component } from 'react'
import jwtDecode from 'jwt-decode'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { setUser } from '../../store/modules/user'
import fetchGraph from '../../store/fetchGraph'
import AuthTwitter from '../../components/AuthTwitter/AuthTwitter'
import EnrichedGrafh from '../../components/EnrichedGraph/EnrichedGrafh'
import PerimeterView from '../../components/PerimeterView/PerimeterView'

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
    const user = this.props.user.login
    ? (
      <div style={{ display: 'flex', maxWidth: '150px', alignItems: 'center', flexFlow: 'column' }}>
        <img src={this.props.user.picUrl} style={{ borderRadius: '5px' }} />
        <span>{this.props.user.screenName}</span>
      </div>
      )
    : (
      <AuthTwitter
        endpointOauthToken={{ method: 'GET', url: urlOauthToken }}
        endpointVerifyToken={{ method: 'POST', url: urlOauthVerify }}
        onFailure={(res) => console.log(res)}
        onSuccess={this.handleLogin}
      />
      )

    return (
      <div>
        <div style={{ position: 'fixed', zIndex: 0 }}>
          {this.props.graph.populated
            ? <EnrichedGrafh width={this.state.width} height={this.state.height} graph={this.props.graph} />
            : <div>wait</div>}
        </div>
        <div style={{ position: 'fixed', zIndex: 1, top: '10px', left: '10px' }}>
          <img src='/assets/logo.svg' width={100} />
        </div>
        <div style={{ position: 'fixed', zIndex: 2, right: '20px', top: '20px' }}>
          {user}
        </div>
        <div style={{ position: 'fixed', zIndex: 3 }}>
          {this.props.perimeters.selected
          ? <PerimeterView data={this.props.perimeters.select} />
          : ''}
        </div>
      </div>
    )
  }
}

Home.propTypes = {
  user: PropTypes.shape({
    login: PropTypes.bool,
    screenName: PropTypes.string,
    picUrl: PropTypes.string
  }),
  perimeters: PropTypes.shape({
    selected: PropTypes.bool,
    select: PropTypes.object
  }),
  graph: PropTypes.shape({
    populated: PropTypes.bool
  }),
  actions: PropTypes.shape({
    fetchGraph: PropTypes.func,
    setUser: PropTypes.func
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
