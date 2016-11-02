import {div} from '@motorcycle/dom'

const view = (state$) => {
  return state$.map(state => {
    return div('.login', [
      state.messageBox,
      state.form
    ])
  })
}

export default view
