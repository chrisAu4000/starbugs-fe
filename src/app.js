import {run} from '@cycle/most-run'
import {makeDOMDriver} from '@motorcycle/dom'
import {createHashHistory} from 'history'
import {makeRouterDriver} from 'cyclic-router'
import {makeHTTPDriver} from './drivers/http-driver'
import switchPath from 'switch-path'
import Main from './main'

const sources = {
  DOM: makeDOMDriver('#application'),
  HTTP: makeHTTPDriver(),
  router: makeRouterDriver(createHashHistory(), switchPath)
}

const app = run(Main, sources)
export default app
