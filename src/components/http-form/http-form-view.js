import {input, button, h, div} from '@motorcycle/dom'
import {curry} from 'ramda'

const view = (state$) => {
  return state$.map(state => {
    return div('.http-form', [
      div('.form-wrapper', state.inputs),
      div('.button-wrapper', [state.submitButton])
    ])
  })
}

export default view;
