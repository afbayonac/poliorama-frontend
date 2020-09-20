import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import configureStore, {history} from './store'

import './index.sass'

import Home from './scenes/Home/Home'
import * as serviceWorker from './serviceWorker'

const store = configureStore()

ReactDOM.render((
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Route path='/' component={Home} />
    </ConnectedRouter>
  </Provider>), document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
