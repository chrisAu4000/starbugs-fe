import {just} from 'most'
import {input} from '@motorcycle/dom'
import isolate from '@cycle/isolate'

const intent = ({DOM}) => {
  return DOM.select('.form-input').events('input').map(e => e.target.value)
}
const view = (state$) => {
  return state$.map( ({disabled, placeholder, type, value}) => {
    return input('.form-input', {attrs: {disabled, placeholder, type, value}})
  })
}
const FormInput = (sources, prop$, change$) => {
  const value$ = intent(sources)
  const state$ = change$
    .scan((state$, transform) => state$.map(transform), prop$)
    .switch()
  return {
    DOM: view(state$),
    value$: value$
  }
}

const IsolatedFormInput = (sources, prop$, change$) => {
  return isolate(FormInput)(sources, prop$, change$)
}

export default IsolatedFormInput
