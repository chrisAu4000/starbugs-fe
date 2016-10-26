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
      DOM: sinks.DOM,
      value$: sinks.value$.map(objOf(as))
    }
    // {
    //   DOM: rememberedDom$,
    //   value$: rememberedValue$.map(objOf(as)),
    // }
  }
  const buttonWrapper = sources => (prop$, change$) => {
    const sinks = SubmitButton(sources, prop$, change$)
    const rememberedDom$ = holdSubject(1)
    const rememberedValue$ = holdSubject(1)
    sinks.DOM.observe(dom => rememberedDom$.next(dom))
    sinks.clicked$.observe(c => rememberedValue$.next(c))
    return sinks;
    // {
    //   DOM: rememberedDom$,
    //   clicked$: rememberedValue$
    // }
  }
  const messageBoxWrapper = sources => (prop$, change$) => {
    const sinks = MessageBox(sources, just([]), change$)
    const rememberedDom$ = holdSubject(1)
    sinks.DOM.observe(dom => rememberedDom$.next(dom))
    return sinks;
    // return {
    //   DOM: rememberedDom$
    // }
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
    HTTP: request$,
    data$: request$.map(req => req.send),
    responseMessages$: responseMessages$
  }
}

export default HTTPForm
