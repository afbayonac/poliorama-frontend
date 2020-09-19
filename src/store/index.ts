
import { StateType, ActionType } from 'typesafe-actions';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'

import user, { initState as initUserState, setUser } from './modules/user'
import graph, { initState as initGraphState, populateGraph } from './modules/graph'
import subject, { initState as initSubjectState, selectSubject, unselectSubject, setSubject } from './modules/subjects'

import { getGraph } from './services/graph.service'

export const history = createBrowserHistory()

// TODO: change this only for develop --------------
const saveStateToLocalStorage = (state: any) => {
  try {
    localStorage.setItem('state', JSON.stringify(state))
  } catch (e) {
    console.log(e)
  }
}

const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('state')
    return serializedState === null ? undefined : JSON.parse(serializedState)
  } catch (e) {
    console.log(e)
  }
}
// ---------------------------------------------------

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__:any;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const initState = loadStateFromLocalStorage() || {
  user: initUserState,
  graph: initGraphState,
  subject: initSubjectState
}

const rootReducer = combineReducers({
  graph,
  subject,
  user,
  router: connectRouter(history)
})

const rootActions = {
  graph: {
    getGraph,
    populateGraph
  },
  user: {
    setUser
  },
  subject: {
    unselectSubject,
    setSubject,
    selectSubject
  }
}

export type Store = typeof initState
export type RootReducer = StateType<typeof rootReducer>
export type RootActions = ActionType<typeof rootActions>

export default () => {
  const store = createStore(
    rootReducer,
    initState,
    composeEnhancers(applyMiddleware(thunk, routerMiddleware(history)))
  )

  store.subscribe(() => saveStateToLocalStorage(store.getState()))

  return store
}
