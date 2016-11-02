import {div} from '@motorcycle/dom'

const view = (state$) => {
  return state$.map(state => {
    return div('.http-form', [
      div('.form-wrapper', state.inputs),
      div('.button-wrapper', [state.submitButton])
    ])
  })
}

export default view
