import {div, button, input, h, svg, ul, li} from '@motorcycle/dom'
import {curry} from 'ramda';

const makeListItem = curry((cls, message) => {
  return li('.message-list-item'+cls, [message.slice(0, 100).concat('...')])
})
const view = (state$) => {
  return state$.map(state => {
    return div('.login', [
      div('.messages', {style: {top: state.errors.length > 0 ? '15%' : '0'}}, [
        ul('.message-list', state.errors.map(makeListItem('.error')))
      ]),
      div('.messages', {style: {top: state.success.length > 0 ? '15%' : '0'}}, [
        ul('.message-list', state.success.map(makeListItem('.success')))
      ]),
      div('.login-form', [
        input('.username', {
          attrs: {
            type: 'text',
            placeholder: 'Name',
            disabled: state.disabled
          }
        }),
        input('.password', {
          attrs: {
            type: 'password',
            placeholder: 'Password',
            disabled: state.disabled
          }
        }),
        button('.submit', {
          attrs: {
            disabled: state.disabled
          },
          style: {
            'border-radius': state.spinner ? '50%' : '3px',
            'width': state.spinner ? '38px' : '100%',
            'margin': state.spinner ? '0 auto' : '0 0',
            'color': state.spinner ? 'transparent' : '#595E5B',
            'opacity': state.spinner ? '0' : '1',
          }
        }, ['Login']),
        h('svg', {
          attrs: {
            class: 'spinner',
            width: '38px',
            height: '38px',
            viewBox: '0 0 39 39',
            xmlns: "http://www.w3.org/2000/svg"
          }, style: {
            'opacity': state.spinner ? '1' : '0',
            // 'z-index': state.spinner ? '1' : '-1',
          }
        },[
          h('circle', {
            attrs: {
              'class': 'path',
              'fill': 'none',
              'stroke-width': '6',
              'stroke-linecap': 'round',
              'cx': '19',
              'cy': '19',
              'r': '16'
            }
          })
        ])
      ])
    ])
  })
}

export default view
