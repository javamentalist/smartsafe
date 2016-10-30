import React from 'react'
import {Route, IndexRoute} from 'react-router'

import App from './screens/app'
import Files from './screens/app/screens/files'
import Settings from './screens/app/screens/settings'

export default(
  <Route path="/" component={App}>
    <IndexRoute component={Files} />
    <Route path="files" component={Files}>
      <Route path="mine" component={Files} />
      <Route path="shared-with-me" component={Files} />
    </Route>
    <Route path="settings" component={Settings}/>
  </Route>
)
