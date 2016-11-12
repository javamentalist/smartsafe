import React from 'react'
import {Route, IndexRoute} from 'react-router'

import App from './views'
import { FileList } from './views/files'
import { Settings } from './views/settings'

export default(
  <Route path="/" component={App}>
    <IndexRoute component={FileList} />
    <Route path="files" component={FileList}/>
    <Route path="settings" component={Settings}/>
  </Route>
)
