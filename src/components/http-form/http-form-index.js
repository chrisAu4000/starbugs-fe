import {objOf} from 'ramda'
import model from './http-form-model'
import view from './http-form-view'
import FormInput from '../form-input/form-input-index'
import SubmitButton from '../submit-button/submit-button-index'

const HTTPForm = (sources, prop$) => {
  const inputWrapper = sources => (as, prop$, change$) => {
    const sinks = FormInput(sources, prop$, change$)
    return {
      DOM: sinks.DOM,
      value$: sinks.value$.map(objOf(as))
    }
  }
  const buttonWrapper = sources => (prop$, change$) => {
    return SubmitButton(sources, prop$, change$)
  }
  const factories = {
    createInput: inputWrapper(sources),
    createButton: buttonWrapper(sources)
  }
  const {
    state$,
    request$,
    messages$
  } = model({http$: sources.HTTP}, factories, prop$)

  return {
    DOM: view(state$),
    HTTP: request$,
    messages$: messages$
  }
}

export default HTTPForm
