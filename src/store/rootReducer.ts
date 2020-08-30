import user  from './modules/user'
import perimeters  from './modules/perimeters'
import graph from './modules/graph'
import { combineReducers } from 'redux'

export default combineReducers({
  graph,
  perimeters,
  user,
})