import {just, merge, combine, combineArray} from 'most'
import {div, input, button, li} from '@motorcycle/dom'
const view = (state$) => {
  return state$.map(state =>{
    return li('.list-item.list-item-li', [
      input('.list-item-input', {
        attrs: {
          type: 'text',
          value: state.value,
        },
        style: {
          background: state.hasFocus ? '#cccccc' : 'transparent',
          'border-bottom' : state.hasFocus ? 'none' : '1px solid black',
          'border-radius' : state.hasFocus ? '3px' : '0'
        }
      }),
      button('.delete-item', ['☓']),
      button('.save-item', {
        style: {
          color: state.isChecked ? 'black' : '#8c8c8c'
        }
      },
      ['✓']),
    ])}
  )
}

const intent = ({DOM}) => {
  return {
    updateContent$: DOM.select('.list-item-input').events('input')
      .map(e => e.target.value)
  , destroy$: DOM.select('.delete-item').events('click')
      .constant(true)
  , enterPressed$: DOM.select('.list-item-input').events('keypress')
      .filter(e => e.key === 'Enter')
      .constant(true)
  , saveContent$: DOM.select('.save-item').events('click')
      .constant(true)
  , focus$: DOM.select('.list-item-input').events('focus').constant(true)
  , unfocus$: DOM.select('.list-item-input').events('focusout').constant(false)
  }
}

const model = (actions, props) => {
  const focus$ = props.hasFocus$.concat(merge(
      actions.focus$
    , actions.unfocus$
    ))
    .map(focus => ({hasFocus: focus}))
  const checked$ = props.isChecked$
    .chain(checked =>
      actions.saveContent$.scan((a, c) => {
        return a + c
      }, checked ? 1 : 0)
    )
    .map(c => c % 2 === 0 ? false : true)
    .map(b => ({isChecked: b}))
  const value$ = props.value.map(value => ({value: value}))
  return combineArray(
      (focus, checked, value) => Object.assign({}, focus, checked, value)
    , [focus$
    , checked$
    , value$]
    )
}

const ListItem = (sources) => {
  const actions = intent(sources)
  const state$ = model(actions, sources.props)
  const view$ = view(state$)
  return {
    DOM: view$
  , actions: actions
  }
}

export default ListItem
