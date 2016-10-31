import {mergeArray, combine, just} from 'most'
import {subject} from 'most-subject'
import view from './main-view.js'
import Router from './components/router/router-index'
import Navigation from './components/navigation/navigation-index'
import config from './config'

import Home from './pages/home/home-index'
import Slideshow from './pages/slideshow/slideshow-index'
import SignUp from './pages/sign-up/sign-up-index'
import Login from './pages/login/login-index.js'

const navPropDefault$ = just([
  {href: '/', title: 'Starbugs'},
  {href: '/login', title: 'Login', active: true},
  {href: '/sign-up', title: 'Signup'}
])

const navPropLogedIn$ = just([
  {href: '/', title: 'Starbugs'},
])

const routerProps = {
  '/': Home,
  '/login': Login,
  '/sign-up': SignUp,
}

const main = (sources) => {
  const routeProxy$= subject()
  const page       = Router(sources, routerProps)
  const navigation = Navigation(sources, navPropDefault$, page.router)

  const view$      = view({navigation$: navigation.DOM, page$: page.DOM})
  const route$     = navigation.router
                    .startWith('/login')
                    .skipRepeats()
  const http$      = page.HTTP
  return {
    DOM: view$,
    HTTP: http$,
    router: route$
  }
}

export default main
