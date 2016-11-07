import {div, ul} from '@motorcycle/dom'
import {combineArray, just, merge, concat} from 'most'
import {curry} from 'ramda'
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
const boxHeight = 210
const display = curry(([prev, curr]) => {
  return prev.length === 0
  ? concat(
      just({
        messages: [],
        visible: false,
        duration: 0
      }),
      combineArray(show, curr)
    )
  : merge(
      combineArray(hide, prev),
      combineArray(show, curr).delay(250)
    )
})
const dom = ({messages, duration, visible}) => {
  return div('.message-box', [
    ul('.message-box-list', {
      style: {
        transition: 'opacity ' + (duration / 1000) + 's, bottom ' + (duration / 1000) + 's',
        opacity: visible ? 1 : 0,
        bottom: visible ? '0px' : boxHeight + 'px'
      }
    },
      messages
    )
  ])
}
const view = (state$) => {
  return state$
    .scan((p, c) => [p[1], c], [[], []])
    .chain(display)
    .map(dom)
}

export default view
