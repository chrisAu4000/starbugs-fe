import {just} from 'most'
import intent from './navigation-intent'
import model from './navigation-model'
import view from './navigation-view'

const Navigation = (sources, prop$) => {
  const action$ = intent(sources)
  const {state$, route$} = model(action$, prop$)
  const view$ = view(state$)
  return {
    DOM: view$
  , router: route$
  }
}

export default Navigation
