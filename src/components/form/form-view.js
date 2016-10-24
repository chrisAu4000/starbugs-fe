import {input, button, h, div} from '@motorcycle/dom'
import {curry} from 'ramda'

const view = (state$, props) => {
  const makeInput = curry((state, {classname, type = 'text', placeholder = ''}) => {
    return input('.'+classname, {
      attrs: {
        type, placeholder,
        disabled: state.disabled
      }
    })
  })
  const makeSubmitButton = (text = 'Submit', state) => {
    return button('.submit', {
      style: {
        'border-radius': state.spinner ? '50%' : '3px',
        'width': state.spinner ? '38px' : '100%',
        'margin': state.spinner ? '0 auto' : '0 0',
        'color': state.spinner ? 'transparent' : '#595E5B',
        'opacity': state.spinner ? '0' : '1',
      }
    }, [text])
  }
  const makeSpinner = (visible) => {
    return h('svg', {
      attrs: {
        class: 'spinner',
        width: '38px',
        height: '38px',
        viewBox: '0 0 39 39',
        xmlns: "http://www.w3.org/2000/svg"
      }, style: {
        'opacity': visible ? '1' : '0',
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
  }
  return state$.map(state => {
    return div('.'+props.classname+'-form',
      props.inputs
        .map(makeInput(state))
        .concat([makeSubmitButton(props.submitButtonText, state)])
        .concat([makeSpinner(state.spinner)])
    )
  })
}

export default view;
