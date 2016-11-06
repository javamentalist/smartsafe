import React from 'react'
import {Route, IndexRoute} from 'react-router'

import App from './views'
import { MyFiles, SharedFiles} from './views/files'
import Settings from './views/settings'

export default(
  <Route path="/" component={App}>
    <IndexRoute component={MyFiles} />
    <Route path="files" component={MyFiles}>
      <Route path="mine" component={MyFiles} />
      <Route path="shared-with-me" component={SharedFiles} />
    </Route>
    <Route path="settings" component={Settings}/>
  </Route>
)
