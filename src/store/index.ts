
import { StateType, ActionType } from 'typesafe-actions';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'

import user, { initState as initUserState, setUser } from './modules/user'
import graph, { initState as initGraphState, populateGraph } from './modules/graph'
import perimeters, { initState as initPerimeterState, selectPerimeter, unselectPerimeter, setPerimeter } from './modules/perimeters'

import { getGraph } from './services/graph.service'

// TODO: change this only for develop

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

//

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__:any;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const initState = loadStateFromLocalStorage() || {
  user: initUserState,
  graph: initPerimeterState,
  perimeters: initGraphState
}

const rootReducer = combineReducers({
  graph,
  perimeters,
  user,
})

const rootActions = {
  graph: {
    getGraph,
    populateGraph
  },
  user: {
    setUser
  },
  perimeters: {
    unselectPerimeter,
    setPerimeter,
    selectPerimeter
  }
}

export type Store = typeof initState
export type RootReducer = typeof rootReducer
export type RootActions = ActionType<typeof rootActions>

export default () => {
  const store = createStore(
    rootReducer,
    initState,
    composeEnhancers(applyMiddleware(thunk))
  )

  store.subscribe(() => saveStateToLocalStorage(store.getState()))

  return store
}