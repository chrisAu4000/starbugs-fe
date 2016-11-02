import {periodic, combine} from 'most'
import {div} from '@motorcycle/dom'
import List from '../../components/list/list-index'

const view = (fade$) => {
  return fade$.map(op =>
    div('.home', {style: {opacity: op}}, ['Home'])
  )
}

const Home = (sources) => {
  const list = List(sources)
  const dur = 1000
  const fade$ = periodic(dur / 10, 1)
    .scan((a, c) => a + c, 1)
    .take(10)
    .map(x => x / 10)
  const view$ = combine(
    (main, list) => div([main, list])
  , view(fade$)
  , list.DOM
  )
  return {
    DOM: view$
  }
}

export default Home
