/* eslint-disable indent */
import React, { Component } from 'react'
import jwtDecode from 'jwt-decode'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { setUser } from '../../store/modules/user'
import { unselectPerimeter } from '../../store/modules/perimeters'

import fetchGraph from '../../store/fetchGraph'
import AuthTwitter from '../../components/AuthTwitter/AuthTwitter'
import EnrichedGrafh from '../../components/EnrichedGraph/EnrichedGrafh'
import Perimeter from '../Perimeter/Perimeter'

import { Avatar } from 'antd'

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
    // Add listeners
    window.addEventListener('resize', () => this.setState({ width: window.innerWidth, height: window.innerHeight }))
    document.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        this.props.actions.unselectPerimeter()
      }
    })

    // Fetch graph data
    this.props.actions.fetchGraph()
  }

  render () {
    const user = this.props.user.login
    ? (
      <div style={{ display: 'flex', maxWidth: '150px', alignItems: 'center', flexFlow: 'column' }}>
        <Avatar src={this.props.user.picUrl} shape='square' size={48} />
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
          <img src='/assets/logo.svg' width={100} alt='logo' />
        </div>
        <div style={{ position: 'fixed', zIndex: 2, right: '20px', top: '20px' }}>
          {user}
        </div>
        <div style={{ position: 'fixed', zIndex: 3 }}>
          {this.props.perimeters.selected
          ? <Perimeter key={this.props.perimeters.select._id} data={this.props.perimeters.select} />
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
    setUser: PropTypes.func,
    unselectPerimeter: PropTypes.func
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
    actions: bindActionCreators({
      setUser,
      fetchGraph,
      unselectPerimeter
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
