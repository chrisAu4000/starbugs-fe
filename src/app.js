import {run} from '@cycle/most-run'
import {makeDOMDriver} from '@motorcycle/dom'
import {createHashHistory} from 'history'
import {makeRouterDriver} from 'cyclic-router'
import switchPath from 'switch-path'
import Main from './main'

const sources = {
  DOM: makeDOMDriver('#application')
, router: makeRouterDriver(createHashHistory(), switchPath)
}

run(Main,sources)
