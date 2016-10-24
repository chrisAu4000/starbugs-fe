import {div, ul, li} from '@motorcycle/dom'
import {just, merge, delay} from 'most'
import {curry} from 'ramda'

const view = (state$) => {
  return state$.map(state => {
    const itemHeight = -210
    console.log(state)
    const makeMessage = ({type, message}) => {
      return li('.message-box-list-item.' + type, [
        message.length > 100
        ? message.trim().slice(0, 100).concat('...')
        : message.trim()
      ])
    }
    return div('.message-box', [
      ul('.message-box-list', {
        style: {
          opacity: state.visible ? 1 : 0,
          bottom: state.visible ? '0px' : itemHeight + 'px'
        }
      },
      state.messages.map(makeMessage)
      )
    ])
  })
}

const MessageBox = (sources, prop$, change$/* = just((x) => x)*/) => {
  const setVisibility = curry((visible, state) => {
    return Object.assign({}, state, {visible: visible})
  })
  const transform = fn => state => {
    return Object.assign({}, state, {messages: fn(state.messages)})
  }
  const state$ = change$
    .scan((state$, fn) => {
      const updatedState$ = state$.map(transform(fn)).multicast()
      const empty$ = updatedState$
        .filter(state => state.messages.length === 0)
        .map(setVisibility(false))
      const filled$ = updatedState$
        .filter(state => state.messages.length > 0)
        .map(setVisibility(true))
      return merge(empty$, filled$).multicast()
    },
      prop$.map(messages => ({visible: true, messages: messages}))
    )
    .multicast()
    .switch()

  return {
    DOM: view(state$)
  }
}

export default MessageBox
