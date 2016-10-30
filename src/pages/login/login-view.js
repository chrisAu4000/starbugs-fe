import {div, button, input, h, svg, ul, li} from '@motorcycle/dom'
import {curry} from 'ramda';

const makeListItem = curry((cls, message) => {
  return li('.message-list-item'+cls, [message.slice(0, 100).concat('...')])
})
const view = (state$) => {
  return state$.map(state => {
    return div('.login', [
      state.messageBox,
      state.form
    ])
  })
}

export default view
