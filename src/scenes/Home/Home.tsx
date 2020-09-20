/* eslint-disable indent */
import React, { useState, useEffect } from 'react'
import { Route, useHistory, useParams } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'

import { getGraph } from '../../store/services/graph.service'
import { setUser } from '../../store/modules/user'
import { Store, RootActions } from '../../store'

import AuthTwitter from '../../components/AuthTwitter/AuthTwitter'
import EnrichedGrafh from '../../components/EnrichedGraph/EnrichedGrafh'
import CreateBar from '../../components/CreateBar/CreateBar'
import SubjectCreate from '../SubjectCreate/SubjectCreate'
import SubjectInfo from '../SubjectInfo/SubjectInfo'
import { Avatar } from 'antd'

import { Subject } from '../../models/subject.model'
import styles from './styles.module.sass'

const urlOauthToken = `${process.env.REACT_APP_API_POLIORAMA}/oauth/twitter`
const urlOauthVerify = `${process.env.REACT_APP_API_POLIORAMA}/oauth/twitter`

interface Props {
  user: {
    login: boolean
    screenName: string
    picUrl: string
  }
  subjects: {
    selected: boolean
    select: Subject
  }
  graph: {
    nodes: Subject[]
    populated: boolean
  }
  actions: {
    getGraph: typeof getGraph
    setUser: typeof setUser
  }
}

const Home = (props: Props) => {
  
  const params = useParams()
  console.log(params)
  const history = useHistory()
  const [sizeWindow, setSizeWindow] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  
  const handleLogin = (data: any) => {
    const user = jwtDecode(data.token)
    props.actions.setUser(user)
  }
  
  useEffect(() => {
    const updateSizeWindows = () => {
      setSizeWindow({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', updateSizeWindows)
    return () => {
      window.removeEventListener('resize', updateSizeWindows)
    }
  }, [])

  useEffect(() => {
    props.actions.getGraph()
  }, [props.actions])


  useEffect(() => {
    const keyEvents = (e: any) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        history.push('/')
      }
    }
    document.addEventListener('keyup', keyEvents)
    return () => document.addEventListener('keyup', keyEvents)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
    <div className={styles.twitterPos}>
      <AuthTwitter
        endpointOauthToken={{ method: 'GET', url: urlOauthToken }}
        endpointVerifyToken={{ method: 'POST', url: urlOauthVerify }}
        onFailure={(error: string) => console.error(error)}
        onSuccess={handleLogin}
      />
    </div>
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
      {user}
      <Route exact path="/subject" component={SubjectCreate}/>
      <Route path="/subject/:subjectKey" component={SubjectInfo} />
    </div>
  )
}



function mapStateToProps (state: Store) {
  return {
    user: state.user,
    graph: state.graph,
    subjects: state.subject
  }
}

function mapDispatchToProps (dispatch: Dispatch<RootActions>) {
  return {
    actions: bindActionCreators({
      setUser,
      getGraph,
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
