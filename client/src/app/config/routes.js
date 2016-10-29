// Note: this file is not currently used, because Sidebar would not render

import React from 'react'
import {Router, Route, IndexRoute, Link, hashHistory} from 'react-router'
import {render} from 'react-dom'

import App from '../screens/app'
import Files from '../screens/app/screens/files'
import Settings from '../screens/app/screens/settings'

const routes = {
  path: '/',
  component: App,
  indexRoute: {
    component: Files
  },
  childRoutes: [
    {
      path: 'settings',
      component: Settings
    }
  ]
}

render(
      <Router history={hashHistory} routes={routes}/>, document.getElementById('content'))


export default routes