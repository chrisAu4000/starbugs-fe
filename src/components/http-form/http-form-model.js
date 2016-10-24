import {just, combineArray, merge, combine} from 'most'
import {subject} from 'most-subject'

const argsToArray = function() {
  return Array.prototype.slice.call(arguments)
}
const arrayToObj = (arr) => arr.reduce((a, c) => Object.assign({}, a, c), {})
const toRequest = http => data => ({
  url: http.url,
  method: http.method,
  send: arrayToObj(data)
})

const model = ({http$}, {createInput, createButton, createMessageBox}, prop$) => {
  const inputStateChange$ = subject()
  const inputs$ = prop$
    .map(({inputs}) => inputs
      .map(input => createInput(input.as, input.prop$, inputStateChange$))
    )
    .multicast()
  const inputValue$ = inputs$
    .chain(inputs => combineArray(
      argsToArray,
      inputs.map(input => input.value$))
    )
  const btnStateChange$ = subject()
  const submitBtn$ = prop$
    .map(({button}) => button.prop$)
    .map(props => createButton(props, btnStateChange$))
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
      .chain(res$ => res$.recoverWith(e => just(e.response.body)))
    )
    .multicast()
  const error$ = response$
    .filter(res => res.status !== 200)
    .map(error => ({error: [error.i18n]}))
    // .multicast()
  error$.observe(res => btnStateChange$.next((state) =>
    Object.assign({}, state, {disabled: false, spinner: false})))
  error$.observe(res => inputStateChange$.next((state) =>
    Object.assign({}, state, {disabled: false})))
  const success$ = response$
    .filter(res => res.status === 200)
    .map(res => ({success: [res.body.i18n]}))
    // .multicast()
  success$.observe(res => btnStateChange$.next((state) =>
    Object.assign({}, state, {disabled: true, spinner: false})))
  const messages$ = subject()
  const messageBox = prop$.map(({messageBox}) => createMessageBox(messageBox.prop$, messages$))
  const responseMessages$ = merge(success$, error$)
  responseMessages$.map(messages => {
    const success = messages.success ? messages.success.map(m => ({type: 'success', message: m})) : []
    const errors = messages.error ? messages.error.map(m => ({type: 'error', message: m})) : []
    return Array.prototype.concat(success, errors)
  })
  .observe(x => messages$.next((state) => x))
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
  const messageBoxDOM$ = messageBox.chain(box => box.DOM)
    .map(bDom => ({messageBox: bDom}))
  const state$ = combineArray(
      Object.assign, [
        messageBoxDOM$,
        inputDOM$,
        submitBtnDOM$
      ]
    )
  return {state$, request$, responseMessages$}
}

export default model;
