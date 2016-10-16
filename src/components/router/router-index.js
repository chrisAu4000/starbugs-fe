import {objOf, merge} from 'ramda'
import {empty} from 'most'

const Router = (sources, props) => {
  const equalPath = (a, b) => a.path === b.path
  const routerProps = props
    .map(({href, handler}) => objOf(href, handler))
    .reduce(merge, {})

  const match$ = sources.router.define(routerProps)
  const page$ = match$
    .skipRepeatsWith(equalPath)
    .map(({path, value}) => {
    return value({
      ...sources
    , router: sources.router.path(path)
    })
  })
  .multicast()
  return {
    DOM: page$.chain(c => c.DOM)
  , router: page$.chain(c => c.router || empty())
  }
}

export default Router
