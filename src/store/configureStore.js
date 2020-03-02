import { createStore, applyMiddleware, compose } from 'redux'
import user from './modules/user'

let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default () => {
  return createStore(
    user,
    composeEnhancers()
  )
}
