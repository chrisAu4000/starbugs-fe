import {just} from 'most'
import intent from './navigation-intent'
import model from './navigation-model'
import view from './navigation-view'

const Navigation = (sources, props) => {
  const prop$ = just(props)
  const action$ = intent(sources)
  const update$ = model(action$, prop$)
  const view$ = view(prop$)
  return {
    DOM: view$
  , router: update$
  }
}

export default Navigation
