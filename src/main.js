import {mergeArray, combine, just} from 'most'
import view from './main-view.js'
import Router from './components/router/router-index'
import Navigation from './components/navigation/navigation-index'
import config from './config'

import Home from './pages/home/home-index'
import Slideshow from './pages/slideshow/slideshow-index'
import Init from './pages/init/init-index'
import Login from './pages/login/login-index.js'

const navProps = [
  {href: '/', title: 'Starbugs', handler: Home}
, {href: '/slideshow', title: 'Slideshow', handler: Slideshow}
, {href: '/initAdmin', title: 'Admin', handler: Init}
, {href: '/login', title: 'Login', handler: Login}
]

const main = (sources) => {
  const page       = Router(sources, navProps)
  const navigation = Navigation(sources, navProps)
  const initialRoute$ = just('/login');

  const view$      = view({navigation$: navigation.DOM, page$: page.DOM})
  const route$     = mergeArray([navigation.router, page.router, initialRoute$])
  const http$      = mergeArray([page.HTTP])
  return {
    DOM: view$,
    HTTP: http$,
    router: route$
  }
}

export default main
