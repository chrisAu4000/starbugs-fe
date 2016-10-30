import {just, combineArray, merge, combine, mergeArray} from 'most'
import {subject, holdSubject} from 'most-subject'
import {curry} from 'ramda'
import config from '../../config'

const argsToArray = function() {
  return Array.prototype.slice.call(arguments)
}
const arrayToObj = (arr) => arr.reduce((a, c) => Object.assign({}, a, c), {})
const toRequest = curry((http, data) => ({
  url: http.url,
  method: http.method,
  send: data
}))

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
  const submitBtnClick$ = submitBtn$
    .chain(btn => btn.clicked$)
  const formData$ = combine(
      (validation = () => [], data) =>{
        const res = validation(data)
        return res.length === 0 ? data : res
      },
      prop$.map(props => props.validation),
      inputValue$.sampleWith(submitBtnClick$).map(arrayToObj)
    )
    .multicast()
  const validationMessage$ = formData$
    .filter(data => Array.isArray(data) === true)
    .map(messages => messages.map(message => ({type: 'error', message: message})))
  const validFormData$ = formData$
    .filter(data => Array.isArray(data) === false)
  const request$ = combine(
      toRequest,
      prop$.map(props => props.http),
      validFormData$
    )
    .tap(_ => btnStateChange$.next(state =>
      Object.assign({}, state, {disabled: true, spinner: true})))
    .tap(_ => inputStateChange$.next(state =>
      Object.assign({}, state, {disabled: true})))
    .multicast()
  const response$ = prop$
    .chain(({http}) => http$
      .filter(res$ => res$.request.url === http.url)
      .chain(res$ => res$.recoverWith(e => just(e.response.body)))
    )
    .multicast()
  const error$ = response$
    .filter(res => res.status !== 200)
    .map(error => [{type: 'error', message: error.i18n}])
    .multicast()
    .tap(_ => btnStateChange$.next((state) =>
      Object.assign({}, state, {disabled: false, spinner: false})))
    .tap(_ => inputStateChange$.next((state) =>
      Object.assign({}, state, {disabled: false})))
  const success$ = response$
    .filter(res => res.status === 200)
    .map(res => [{type: 'success', message: res.body.i18n}])
    .multicast()
    .tap(_ => btnStateChange$.next((state) =>
      Object.assign({}, state, {disabled: true, spinner: false})))
  const messages$ = mergeArray([success$, error$, validationMessage$])
  const inputDOM$ = inputs$
    .chain(inputs => combineArray(argsToArray, inputs.map(input => input.DOM)))
    .map(iDoms => ({inputs: iDoms}))
  const submitBtnDOM$ = submitBtn$.chain(btn => btn.DOM)
    .map(bDom => ({submitButton: bDom}))
  const state$ = combineArray(Object.assign, [inputDOM$, submitBtnDOM$])
  return {state$, request$, messages$}
}

export default model;
