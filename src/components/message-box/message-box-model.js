import {mergeArray, merge, concat, just, combineArray} from 'most'
import {map, filter, curry} from 'ramda'
const display = curry(([prev, curr]) => {
  const prepare = ({
    messages: [],
    visible: false,
    duration: 0
  })
  const show = (...messages) => ({
    messages: messages,
    visible: true,
    duration: 250
  })
  const hide = (...messages) => ({
    messages: messages,
    visible: false,
    duration: 250
  })
  return prev.length === 0
  ? concat(just(prepare), combineArray(show, curr))
  : merge(combineArray(hide, prev), combineArray(show, curr).delay(250))
})

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
    .scan((p, c) => [p[1], c], [[], []])
    .chain(display)
  const messageAction$ = messages$
    .chain(messages => mergeArray(messages.map(message => message.action$)))
  return {state$, messageAction$}
}

export default model
