import {just} from 'most'
import {objOf} from 'ramda'
import {holdSubject} from 'most-subject'
import model from './http-form-model'
import view from './http-form-view'
import FormInput from '../form-input/form-input-index'
import SubmitButton from '../submit-button/submit-button-index'
import MessageBox from '../message-box/message-box-index'

const HTTPForm = (sources, prop$) => {
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
    return SubmitButton(sources, prop$, change$)
  }
  const messageBoxWrapper = sources => (prop$, change$) => {
    return MessageBox(sources, just([]), change$)
  }
  const factories = {
    createInput: inputWrapper(sources),
    createButton: buttonWrapper(sources),
    createMessageBox: messageBoxWrapper(sources),
  }

  const {
    state$,
    request$,
    responseMessages$
  } = model({http$: sources.HTTP}, factories, prop$)

  return {
    DOM: view(state$),
    HTTP: request$.multicast(),
    data$: request$.map(req => req.send),
    responseMessages$: responseMessages$
  }
}

export default HTTPForm
