import React from 'react'
import {Route, IndexRedirect} from 'react-router'

import App from './views'
import {FileList, FileDetail} from './views/files'
import {Settings} from './views/settings'

export default(
  <Route path="/" component={App}>
    <IndexRedirect to="/files"/>
    <Route path="files" component={FileList}/>
    <Route path="files/:fileId" component={FileDetail}/>
    <Route path="settings" component={Settings}/>
  </Route>
)
