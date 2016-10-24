import {just, combineArray, merge, combine} from 'most'
import {subject} from 'most-subject'
const model = ({http$}, {createInput, createButton}, prop$) => {
  const argsToArray = function() {
    return Array.prototype.slice.call(arguments)
  }
  const arrayToObj = (arr) => arr.reduce((a, c) => Object.assign({}, a, c), {})
  const toRequest = http => data => ({
    url: http.url,
    method: http.method,
    send: arrayToObj(data)
  })
  const inputStateChange$ = subject()
  const inputs$ = prop$
    .map(({inputs}) => inputs
      .map(input => createInput(input.as, input.prop$, inputStateChange$))
    )
    .multicast()
  const inputValue$ = inputs$
    .chain(inputs => combineArray(argsToArray, inputs.map(x => x.value$)))
  const btnStateChange$ = subject()
  const submitBtn$ = prop$
    .map(({button}) => button.prop$)
    .map((props) => createButton(props, btnStateChange$))
    .multicast()
  const submitBtnClick$ = submitBtn$.chain(btn => btn.clicked$)
  const request$ = prop$
    .chain(({http}) => inputValue$
      .sampleWith(submitBtnClick$)
      .map(toRequest(http))
    )
    .multicast()
  request$.observe(req => btnStateChange$.next((state) =>
    Object.assign({}, state, {disabled: true, spinner: true})))
  request$.observe(req => inputStateChange$.next((state) =>
    Object.assign({}, state, {disabled: true})))
  const response$ = prop$
    .chain(({http}) => http$
      .filter(res$ => res$.request.url === http.url)
      .map(res$ => res$.recoverWith(e => {
        return just(e.response.body)
      }))
      .switch()
    )
    .multicast()
  const error$ = response$
    .filter(res => res.status !== 200)
  error$.observe(res => btnStateChange$.next((state) =>
    Object.assign({}, state, {disabled: false, spinner: false})))
  error$.observe(res => inputStateChange$.next((state) =>
    Object.assign({}, state, {disabled: false})))
  const success$ = response$
    .filter(res => res.status === 200)
    .map(res => res.body.message)
  success$.observe(res => btnStateProxy$.next((state) =>
    Object.assign({}, state, {disabled: true, spinner: false})))
  const inputDOM$ = inputs$
    .chain(inputs =>{
      return combineArray(
        argsToArray,
        inputs.map(input => input.DOM)
      )}
    )
    .map(iDoms => ({inputs: iDoms}))
  const submitBtnDOM$ = submitBtn$.chain(btn => btn.DOM)
    .map(bDom => ({submitButton: bDom}))
  const state$ = combine(
      Object.assign,
      inputDOM$,
      submitBtnDOM$
    )
  return {state$, request$}
}

export default model;
