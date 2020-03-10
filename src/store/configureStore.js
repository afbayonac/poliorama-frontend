import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import user, { initState as initUserState} from './modules/user'
import graph, { initState as initGraphState} from './modules/graph'
import perimeters, { initState as initPerimeterState} from './modules/perimeters'
import thunk from 'redux-thunk'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const reducer = combineReducers({
  user: user,
  graph: graph,
  perimeters: perimeters
})

const initState = {
  user: initUserState,
  graph: initPerimeterState,
  perimeters: initGraphState
}
export default () => {
  return createStore(
    reducer,
    initState,
    composeEnhancers(applyMiddleware(thunk))
  )
}
