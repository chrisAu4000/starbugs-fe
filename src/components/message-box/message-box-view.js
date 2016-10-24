import {div, ul, li} from '@motorcycle/dom'

const view = (state$) => {
  return state$.map(state => {
    const boxHeight = 210
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
          bottom: state.visible ? '0px' : -boxHeight + 'px'
        }
      },
        state.messages.slice(-5).map(makeMessage)
      )
    ])
  })
}

export default view
