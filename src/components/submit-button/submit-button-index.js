import {button, h, div} from '@motorcycle/dom'
import {just} from 'most'
import isolate from '@cycle/isolate'

const view = (state$) =>
  state$.map(state =>
    div('.submit-button', [
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
          'cursor': state.spinner ? 'default' : 'pointer',
        }
      }, [state.label]),
      h('svg', {
        attrs: {
          class: 'spinner',
          width: '38px',
          height: '38px',
          viewBox: '0 0 39 39',
          xmlns: "http://www.w3.org/2000/svg"
        }, style: {
          'opacity': state.spinner ? '1' : '0',
          'cursor': state.spinner ? 'default' : 'pointer',
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
  )

const intent = ({DOM}) => {
  return DOM.select('.submit').events('click').constant(true)
}

const SubmitButton = (sources, prop$, change$ = just((x)=>x)) => {
  const click$ = intent(sources)
  const state$ = change$
    .scan((state, transform) => {
      return state.map(transform)
    }, prop$)
    .switch()
  return {
    DOM: view(state$),
    clicked$: intent(sources)
  }
}

const IsolatedSubmitButton = (sources, prop$, change$) => {
  return isolate(SubmitButton)(sources, prop$, change$)
}

export default IsolatedSubmitButton
