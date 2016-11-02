import {div, ul} from '@motorcycle/dom'
import {combine} from 'most'

const view = (state$) => {
  // return state$.map(v => {
  //   console.log(v)
  //   return div(v.tap(x => console.log(x)))
  // })
  return state$.chain(state => {
    const boxHeight = 210
    console.log(state)
    return state.messages.map(msgs => {
      return div('.message-box', [
        ul('.message-box-list', {
          style: {
            transition: 'opacity ' + (state.duration / 1000) + 's, bottom ' + (state.duration / 1000) + 's',
            opacity: state.visible ? 1 : 0,
            bottom: state.visible ? '0px' : boxHeight + 'px'
          }
        },
          msgs
        )
      ])
    })
  })
  .tap(x => console.log(x))
}

export default view
