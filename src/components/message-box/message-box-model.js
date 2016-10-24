import {merge} from 'most'
import {curry} from 'ramda'
const model = (prop$, change$) => {
  const setVisibility = curry((visible, state) => {
    return Object.assign({}, state, {visible: visible})
  })
  return change$
    .loop((state$, fn) => {
      return {
        seed: state$.map(fn),
        value: {prev$: state$, curr$: state$.map(fn)}
      }
    }, prop$)
    .chain(state =>
      merge(
        state.prev$.map(messages => ({messages: messages})).map(setVisibility(false)),
        state.curr$.map(messages => ({messages: messages})).map(setVisibility(true)).delay(250)
      )
    )
    .merge(prop$.take(1).map(messages => ({visible: true, messages: messages})))
}

export default model
