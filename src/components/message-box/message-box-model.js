import {just, merge, concat, mergeArray, combineArray} from 'most'
import {compose, objOf, assoc} from 'ramda'

const model = (prop$, createMessage, change$) => {
  const setVisibility = assoc('visible')
  const setDuration = assoc('duration')
  const toMessages = objOf('messages')
  const setInvisible = compose(setVisibility(false), toMessages)
  const setVisible = compose(setVisibility(true), toMessages)
  const instantInvisible = compose(setDuration(0), setInvisible)
  const delayedVisible = compose(setDuration(250), setVisible)
  const toArray = function () {
    return Array.prototype.slice.call(arguments)
  }
  const display = (state) => {
    const instant$ = state.prev$
      .filter(state => state.length === 0)
      .chain(() =>
        concat(
          state.prev$.map(instantInvisible),
          state.curr$.map(delayedVisible).delay(10)
        )
      )
    const delayed$ = state.prev$
      .filter(state => state.length > 0)
      .chain(() =>
        merge(
          state.prev$.map(setInvisible),
          state.curr$.map(setVisible).delay(250)
        )
        .map(setDuration(250))
      )
    return merge(instant$, delayed$)
  }
  const messages$ = prop$
    .map(state => state.map(createMessage))
    .map(state => ({prev$: just([]), curr$: just(state)}))
    .concat(
      change$
      .loop((state$, fn) => {
        return {
          seed: state$.map(fn).map(state => state.map(createMessage)),
          value: {prev$: state$, curr$: state$.map(fn).map(state => state.map(createMessage))}
        }
      }, prop$)
    )
    .chain(display)
    .multicast()

  const state$ = messages$
    .map(messages => Object.assign({}, messages, {
      messages: messages.messages.length === 0
        ? just([])
        : combineArray(toArray, messages.messages.map(message => message.DOM))
    }))

  const messageAction$ = messages$
    .chain(({messages}) =>
      mergeArray(messages.map(message => message.action$))
    )
  return {state$, messageAction$}
}

export default model
