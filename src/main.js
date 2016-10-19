import {mergeArray, combine, just} from 'most'
import view from './main-view.js'
import Router from './components/router/router-index'
import Navigation from './components/navigation/navigation-index'
import config from './config'

import Home from './pages/home/home-index'
import Slideshow from './pages/slideshow/slideshow-index'
import Init from './pages/init/init-index'

const navProps = [
  {href: '/', title: 'Home', handler: Home}
, {href: '/slideshow', title: 'Slideshow', handler: Slideshow}
, {href: '/initAdmin', title: 'Admin', handler: Init}
]

const main = (sources) => {
  const request$ = just({url: config.url.init, method: 'POST'})
  const page       = Router(sources, navProps)
  const navigation = Navigation(sources, navProps)
  const initialRoute$ = sources.HTTP
    .filter(res$ => res$.request.url === config.url.init)
    .join()
    .map(res => res.usercount)
    .map(ucount => ucount <= 0 ? '/initAdmin' : '/')

  const view$      = view({navigation$: navigation.DOM, page$: page.DOM})
  const route$     = mergeArray([navigation.router, page.router, initialRoute$])
  const http$      = mergeArray([request$, page.HTTP])
  return {
    DOM: view$,
    HTTP: http$,
    router: route$
  }
}

export default main
