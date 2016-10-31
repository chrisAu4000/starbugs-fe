import {just, merge, empty} from 'most'
import intent from './navigation-intent'
import model from './navigation-model'
import view from './navigation-view'

const Navigation = (sources, prop$, change$ = empty()) => {
  const action$ = merge(intent(sources), change$)
  const {state$, route$} = model(action$, prop$)
  const view$ = view(state$)
  return {
    DOM: view$
  , router: route$
  }
}

export default Navigation
