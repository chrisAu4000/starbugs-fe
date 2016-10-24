import {combineArray, mergeArray, combine, just} from 'most'
import {objOf, curry} from 'ramda'
import {div} from '@motorcycle/dom'
import {holdSubject} from 'most-subject'
// import intent from './form-intent'
import model from './form-model'
// import view from './form-view'
import FormInput from '../form-input/form-input-index'
import SubmitButton from '../submit-button/submit-button-index'

const view = (state$) => {
  return state$.map(state => {
    return div('.form', [
    ]
    .concat(
      state.inputs,
      [state.submitButton]
    ))
  })
}


const Form = (sources, prop$) => {
  const inputWrapper = sources => (as, prop$, change$) => {
    const sinks = FormInput(sources, prop$, change$)
    const rememberedValue$ = holdSubject(1)
    const rememberedDom$ = holdSubject(1)
    sinks.value$.observe(val => rememberedValue$.next(val))
    sinks.DOM.observe(dom => rememberedDom$.next(dom))
    return {
      DOM: rememberedDom$,
      value$: rememberedValue$.map(objOf(as)),
    }
  }
  const buttonWrapper = sources => (prop$, change$) => {
    const sinks = SubmitButton(sources, prop$, change$)
    return sinks
  }
  const factories = {
    createInput: inputWrapper(sources),
    createButton: buttonWrapper(sources)
  }
  const {state$, request$} = model({http$: sources.HTTP}, factories, prop$)

  return {
    DOM: view(state$),
    HTTP: request$,
    data$: request$.map(req => req.send)
  }
}

export default Form
