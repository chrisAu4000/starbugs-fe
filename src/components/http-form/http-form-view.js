import {input, button, h, div} from '@motorcycle/dom'
import {curry} from 'ramda'

const view = (state$) => {
  return state$.map(state => {
    return div('.form', [
    ]
    .concat(
      state.messageBox,
      state.inputs,
      [state.submitButton]
    ))
  })
}

export default view;
