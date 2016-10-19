import {run} from '@cycle/most-run'
import {makeDOMDriver} from '@motorcycle/dom'
import {createHashHistory} from 'history'
import {makeRouterDriver} from 'cyclic-router'
import {makeHTTPDriver} from '@motorcycle/http'
import switchPath from 'switch-path'
import Main from './main'

const sources = {
  DOM: makeDOMDriver('#application'),
  HTTP: makeHTTPDriver(),
  router: makeRouterDriver(createHashHistory(), switchPath)
}

run(Main,sources)
