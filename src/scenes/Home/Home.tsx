/* eslint-disable indent */
import React, { useState, useEffect, useCallback } from 'react'
import jwtDecode from 'jwt-decode'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { unselectPerimeter } from '../../store/modules/perimeters'

import { getGrafh } from '../../store/services/graph.service'
import { setUser } from '../../store/modules/user'
import AuthTwitter from '../../components/AuthTwitter/AuthTwitter'
import EnrichedGrafh from '../../components/EnrichedGraph/EnrichedGrafh'
import Perimeter from '../../scenes/Perimeter/Perimeter'
import { Avatar } from 'antd'
import { Store } from '../../store'
import { Perimeter as PerimeterModel } from '../../models/perimeter.model'

const urlOauthToken = `${process.env.REACT_APP_API_POLIORAMA}/oauth/twitter`
const urlOauthVerify = `${process.env.REACT_APP_API_POLIORAMA}/oauth/twitter`

interface Props {
  user: {
    login: boolean
    screenName: string
    picUrl: string
  },
  // PropTypes.shape({
  //   login: PropTypes.bool,
  //   screenName: PropTypes.string,
  //   picUrl: PropTypes.string
  // }),
  perimeters: {
    selected: boolean
    select: PerimeterModel
  }
  // PropTypes.shape({
  //   selected: PropTypes.bool,
  //   select: PropTypes.object
  // }),
  graph: {
    populated: boolean
  }
  // PropTypes.shape({
  //   populated: PropTypes.bool
  // }),
  actions: {
    getGrafh: Dispatch
    setUser: Dispatch
    unselectPerimeter: Dispatch
  }
  // PropTypes.shape({
  //   fetchGraph: PropTypes.func,
  //   setUser: PropTypes.func,
  //   unselectPerimeter: PropTypes.func
  // })
}

const Home = (props: Props) => {
  const [sizeWindow, setSizeWindow] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  const handleLogin = (data: any) => {
    const user = jwtDecode(data.token)
    props.actions.setUser(user)
  }

  const updateSizeWindows = useCallback(() => {
    setSizeWindow({ width: window.innerWidth, height: window.innerHeight })
  }, [])

  useEffect(() => {
    window.addEventListener('resize', updateSizeWindows)
    return () => {
      window.removeEventListener('resize', updateSizeWindows)
    }
  }, [])

  useEffect(() => {
    props.actions.getGrafh()
  }, [])

  const keyEvents = useCallback((e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      props.actions.unselectPerimeter()
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keyup', keyEvents)
    return () => document.addEventListener('keyup', keyEvents)
  }, [])

  const user = props.user.login
  ? (
    <div style={{ display: 'flex', maxWidth: '150px', alignItems: 'center', flexFlow: 'column' }}>
      <Avatar src={props.user.picUrl} shape='square' size={48} />
    </div>
    )
  : (
    <AuthTwitter
      endpointOauthToken={{ method: 'GET', url: urlOauthToken }}
      endpointVerifyToken={{ method: 'POST', url: urlOauthVerify }}
      onFailure={(error: string) => console.error(error)}
      onSuccess={handleLogin}
    />
    )

  return (
    <div>
      <div style={{ position: 'fixed', zIndex: 0 }}>
        {props.graph.populated
        ? <EnrichedGrafh width={sizeWindow.width} height={sizeWindow.height} graph={props.graph} />
        : <div>wait</div>}
      </div>
      <div style={{ position: 'fixed', zIndex: 1, top: '10px', left: '10px' }}>
        <img src='/assets/logo.svg' width={100} alt='logo' />
      </div>
      <div style={{ position: 'fixed', zIndex: 2, right: '20px', top: '20px' }}>
        {user}
      </div>
      <div style={{ position: 'fixed', zIndex: 3 }}>
        {props.perimeters.selected
        ? <Perimeter key={props.perimeters.select._id} perimeter={props.perimeters.select} />
        : ''}
      </div>
    </div>
  )
}



function mapStateToProps (state: Store) {
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
      getGrafh,
      unselectPerimeter
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
