import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import user, { initState as initUserState } from './modules/user'
import graph, { initState as initGraphState } from './modules/graph'
import perimeters, { initState as initPerimeterState } from './modules/perimeters'
import thunk from 'redux-thunk'

// TODO: change this only for develop

const saveStateToLocalStorage = (state) => {
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

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const reducer = combineReducers({
  user: user,
  graph: graph,
  perimeters: perimeters
})

const initState = loadStateFromLocalStorage() || {
  user: initUserState,
  graph: initPerimeterState,
  perimeters: initGraphState
}

export default () => {
  const store = createStore(
    reducer,
    initState,
    composeEnhancers(applyMiddleware(thunk))
  )

  store.subscribe(() => saveStateToLocalStorage(store.getState()))

  return store
}
