import {just} from 'most'
import {holdSubject} from 'most-subject'
import isolate from '@cycle/isolate'
import view from './message-box-view'
import model from './message-box-model'
import Message from '../message/message-index'
import MessageConfirm from '../message-confirm/message-confirm-index'

const itemFactory = (sources) => {
  let index = 0
  return (props, i) => {
    index += 1
    const sinks = isolate(MessageConfirm)(sources, just(props))
    const rememberedDom$ = holdSubject(1)
    sinks.DOM.observe(dom => rememberedDom$.next(dom))
    return {
      DOM: rememberedDom$,
      action$: sinks.action$.constant(index - 1)
    }
  }
}

const MessageBox = (sources, prop$, change$ = just((x) => x)) => {
  const {state$, messageAction$} = model(prop$, itemFactory(sources), change$)
  messageAction$.observe(x => console.log(x))
  return {
    DOM: view(state$)
  }
}

export default MessageBox
