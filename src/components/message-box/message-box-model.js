import {mergeArray, merge} from 'most'
import {map, filter} from 'ramda'

const model = (prop$, createMessage, change$) => {
  /* eslint-disable */
  let id = 0
  const setId = map((message) => {
    id += 1
    const sinks = createMessage(message)
    return {
      DOM: sinks.DOM,
      action$: sinks.action$.constant(id),
      id: id
    }
  })
  /* eslint-enable */
  const addMessage$ = change$
    .filter(change => change.action === 'ADD_MESSAGE')
    .map(change => change.payload)
    .map(setId)
    .map(messages => () => messages)
  const delMessage$ = change$
    .filter(change => change.action === 'DEL_MESSAGE')
    .map(change => change.payload)
    .map(id => filter(message => message.id !== id))
  const messages$ = merge(addMessage$, delMessage$)
    .scan((state$, fn) => state$.map(fn), prop$.map(setId))
    .switch()
    .multicast()
  const state$ = messages$
    .map(messages => messages.map(message => message.DOM))
  const messageAction$ = messages$
    .chain(messages => mergeArray(messages.map(message => message.action$)))
  return {state$, messageAction$}
}

export default model
