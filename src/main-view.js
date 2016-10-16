import {div} from '@motorcycle/dom'
import {combine} from 'most'

const mainView = ({navigation, page}) => {
  return div('.app', [
    div('.navigation', [navigation]),
    div('.page', [page])
  ])
}

const view = ({navigation$, page$}) => {
  const makeViewObj = (x, y) => ({navigation: x, page: y})
  return combine(
    makeViewObj
  , navigation$
  , page$
  )
  .map(mainView)
}

export default view
