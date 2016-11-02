import {li} from '@motorcycle/dom'
import {empty} from 'most'

const view = (state$) => {
  return state$.map(({type, message}) => {
    return li('.message.' + type, [
      message.length > 100
      ? message.trim().slice(0, 100).concat('...')
      : message.trim()
    ])
  })
}

const Message = (sources, prop$) => {
  return {
    DOM: view(prop$),
    action$: empty()
  }
}

export default Message
