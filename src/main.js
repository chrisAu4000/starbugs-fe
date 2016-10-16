import {merge, combine} from 'most'
import view from './main-view.js'
import Router from './components/router/router-index'
import Navigation from './components/navigation/navigation-index'

import Home from './pages/home/home-index'
import Slideshow from './pages/slideshow/slideshow-index'

const navProps = [
  {href: '/', title: 'Home', handler: Home}
, {href: '/slideshow', title: 'Slideshow', handler: Slideshow}
]

const main = (sources) => {
  const page       = Router(sources, navProps)
  const navigation = Navigation(sources, navProps)
  const view$      = view({navigation$: navigation.DOM, page$: page.DOM})
  const route$     = merge(navigation.router, page.router)
  return {
    DOM: view$
  , router: route$
  }
}

export default main
