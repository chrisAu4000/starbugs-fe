import {input, button, li} from '@motorcycle/dom'

const view = (state$) => {
  return state$.map(state => {
    return li('.list-item.list-item-li', [
      input('.list-item-input', {
        attrs: {
          type: 'text',
          value: state.value
        },
        style: {
          background: state.hasFocus ? '#cccccc' : 'transparent',
          'border-bottom': state.hasFocus ? 'none' : '1px solid black',
          'border-radius': state.hasFocus ? '3px' : '0'
        }
      }),
      button('.delete-item', ['☓']),
      button('.save-item', {
        style: {
          color: state.isChecked ? 'black' : '#8c8c8c'
        }
      },
      ['✓'])
    ])
  })
}

export default view
