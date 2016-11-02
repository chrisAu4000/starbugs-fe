import {merge, combineArray} from 'most'

const model = (actions, props) => {
  const focus$ = props.hasFocus$.concat(merge(
      actions.focus$,
      actions.unfocus$
    ))
    .map(focus => ({hasFocus: focus}))
  const checked$ = props.isChecked$
    .chain(checked =>
      actions.saveContent$.scan((a, c) => {
        return a + c
      }, checked ? 1 : 0)
    )
    .map(c => c % 2 === 0)
    .map(b => ({isChecked: b}))
  const value$ = props.value.map(value => ({value: value}))
  return combineArray(
    (focus, checked, value) => Object.assign({}, focus, checked, value),
    [focus$, checked$, value$]
  )
}

export default model
