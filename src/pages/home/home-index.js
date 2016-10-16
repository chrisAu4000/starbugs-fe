import {just, periodic, from, combine} from 'most'
import {div} from '@motorcycle/dom'
import {objOf, assocPath} from 'ramda'
import List from '../../components/list/list-index'
import ListItem from '../../components/list-item/list-item-index'

const view = (fade$) => {
  return fade$.map(op =>
    div('.home', {style: {opacity: op}}, ['Home'])
  )
}

const Home = (sources) => {
  const list = List(sources)
  const dur = 1000;
  const fade$ = periodic(dur/10, 1)
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
