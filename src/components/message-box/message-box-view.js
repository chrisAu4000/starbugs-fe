import {div, ul} from '@motorcycle/dom'
import {combineArray, just, merge, concat} from 'most'
import {curry} from 'ramda'

const boxHeight = 210

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
const view = (state$) => state$.map(dom)

export default view
