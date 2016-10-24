import {just, combineArray, merge, combine} from 'most'
import {subject} from 'most-subject'
import {div, input, button, label, h} from '@motorcycle/dom'
import config from '../../config'
import Form from '../../components/form/form-index'
import FormInput from '../../components/form-input/form-input-index'
import SubmitButton from '../../components/submit-button/submit-button-index'
import MessageBox from '../../components/message-box/message-box-index'

const intent = ({DOM}) => {
  return {
    username$: DOM.select('.username').events('input').map(e => e.target.value),
    password$: DOM.select('.password').events('input').map(e => e.target.value),
    email$: DOM.select('.email').events('input').map(e => e.target.value),
    submit$: DOM.select('.submit').events('click').constant(0)
  }
}

const model = (formData$, http$, url) => {
  const validation = ({username, password, verifyPassword, email}) => {
    return username.length > 0
        && password.length > 8
        && password === verifyPassword
        && email.length > 5
  }
  const toRequest = (data) => ({
    url: config.url.signup,
    method: 'POST',
    send: data
  })
  const handleBadRequest$ = (res$) =>
    res$.recoverWith(err => just({body: {message: err.message}}))
  const request$ = formData$
    .filter(validation)
    .map(toRequest)
  const response$ = http$
    .filter(res$ => res$.request.url === config.url.signup)
    .map(handleBadRequest$)
    .join()
  const success$ = response$
    .filter(res => res.status === 200)
  const error$ = response$
    .filter(res => res.status !== 200)
  const state$ = merge(
      success$.map(res => ({success: true, messages: [res.body.message]})),
      error$.map(err => ({success: false, messages: [err.message]}))
    )
    .startWith({success: false, messages: []})
  return {request$, state$}
}

const view = (state$) => {
  return state$.map(state => {
    // console.log(state)
    return div('.signup', [state.messageBox, state.form])
  })
}

const Init = (sources) => {
  const formProp$ = just({
    inputs: [
      {as: 'username',        prop$: just({disabled: false, placeholder: 'Username', type: 'text', value:''})},
      {as: 'email',           prop$: just({disabled: false, placeholder: 'Email', type: 'email', value:''})},
      {as: 'password',        prop$: just({disabled: false, placeholder: 'Password', type: 'password', value:''})},
      {as: 'verify-password', prop$: just({disabled: false, placeholder: 'Verify Password', type: 'password', value:''})}
    ],
    button: {
      prop$: just({disabled: false, spinner: false, label: 'Sign In'})
    },
    http: {
      url: config.url.signup,
      method: 'POST'
    }
  })
  const msgBoxProp$ = just([
      {type: 'error', message: 'This is an error :('},
      {type: 'success', message: 'This is a success :)'}
    ])
  const change$ = subject()
  const messageBox = MessageBox(sources, msgBoxProp$, change$)
  const form = Form(sources, formProp$)
  // const {request$, state$} = model(form.data$, sources.HTTP, config.url.signup)
  const c$ = sources.DOM.select('.page').events('click').constant(+1)
    .scan((a, c) => a+c, 0)
    .map(x => {
      return x % 2 === 0 ? (mgs) => [] : (mgs) => mgs.concat([{type: 'error', message: 'YEAH'}])
      })
  c$.observe(x => change$.next(x))
  // const formState$ = state$.map(state => {
  //   if (state.success) {
  //     return 'success'
  //   }
  //   if (state.messages.length === 0) {
  //     return 'init'
  //   }
  //   if (state.messages.length > 0) {
  //     return 'error'
  //   }
  // })
  // formState$.observe(formState => formStateProxy$.next(formState))
  const state$ = combineArray((i1, i2) => {
    return {form: i1, messageBox: i2}
  }, [form.DOM, messageBox.DOM])
  const vtree$ = view(state$)
  return {
    DOM: vtree$,
    HTTP: form.HTTP,
  }
}

export default Init
