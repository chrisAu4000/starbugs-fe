import {just} from 'most'
import {holdSubject} from 'most-subject'
import view from './message-box-view'
import model from './message-box-model'
import Message from '../message/message-index'

const itemFactory = (sources) => (props) => {
  const sinks = Message(sources, just(props))
  const rememberedDom$ = holdSubject(1)
  sinks.DOM.observe(dom => rememberedDom$.next(dom))
  return {
    DOM: rememberedDom$.tap(x => console.log(x)),
    action$: sinks.action$
  }
}

const MessageBox = (sources, prop$, change$ = just((x) => x)) => {
  const {state$, messageAction$} = model(prop$, itemFactory(sources), change$)
  return {
    DOM: view(state$)
  }
}

export default MessageBox
