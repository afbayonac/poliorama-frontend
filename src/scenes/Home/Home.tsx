/* eslint-disable indent */
import React, { useState, useEffect, useCallback } from 'react'
import { Route } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'

import { unselectPerimeter } from '../../store/modules/perimeters'
import { getGraph } from '../../store/services/graph.service'
import { setUser } from '../../store/modules/user'
import { Store, RootActions } from '../../store'

import AuthTwitter from '../../components/AuthTwitter/AuthTwitter'
import EnrichedGrafh from '../../components/EnrichedGraph/EnrichedGrafh'
import CreateBar from '../../components/CreateBar/CreateBar'
import CreateSubject from '../../components/CreateSubject/CreateSubject'
import Perimeter from '../../scenes/Perimeter/Perimeter'
import { Avatar } from 'antd'

import { Perimeter as PerimeterModel } from '../../models/perimeter.model'
import styles from './styles.module.sass'

const urlOauthToken = `${process.env.REACT_APP_API_POLIORAMA}/oauth/twitter`
const urlOauthVerify = `${process.env.REACT_APP_API_POLIORAMA}/oauth/twitter`

interface Props {
  user: {
    login: boolean
    screenName: string
    picUrl: string
  }
  perimeters: {
    selected: boolean
    select: PerimeterModel
  }
  graph: {
    populated: boolean
  }
  actions: {
    getGraph: typeof getGraph
    setUser: typeof setUser
    unselectPerimeter: typeof unselectPerimeter
  }
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
    props.actions.getGraph()
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
    <>
      <div className={styles.user}>
        <Avatar src={props.user.picUrl} shape='square' size={48} />
      </div>
      <div className={styles.createBarPos}>
        <CreateBar></CreateBar>
      </div>
      
    </>
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
        ? <EnrichedGrafh width={sizeWindow.width} height={sizeWindow.height} />
        : <div>wait</div>}
      </div>
      <div style={{ position: 'fixed', zIndex: 1, top: '10px', left: '10px' }}>
        <img src='/assets/logo.svg' width={100} alt='logo' />
      </div>
      <div>
        {user}
      </div>
      <div style={{ position: 'fixed', zIndex: 3 }}>
        {props.perimeters.selected
        ? <Perimeter key={props.perimeters.select._id} perimeter={props.perimeters.select} />
        : ''}
      </div>
      <Route path="/subject" component={CreateSubject}/>
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

function mapDispatchToProps (dispatch: Dispatch<RootActions>) {
  return {
    actions: bindActionCreators({
      setUser,
      getGraph,
      unselectPerimeter
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
