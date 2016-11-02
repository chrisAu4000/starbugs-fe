import {just} from 'most'
import isolate from '@cycle/isolate'
import view from './submit-button-view'
import intent from './submit-button-intent'

const SubmitButton = (sources, prop$, change$ = just((x) => x)) => {
  const state$ = change$
    .scan((state, transform) => {
      return state.map(transform)
    }, prop$)
    .switch()
  return {
    DOM: view(state$),
    clicked$: intent(sources)
  }
}

const IsolatedSubmitButton = (sources, prop$, change$) => {
  return isolate(SubmitButton)(sources, prop$, change$)
}

export default IsolatedSubmitButton
