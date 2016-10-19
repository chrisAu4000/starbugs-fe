import {just, combineArray, merge} from 'most'
import {div, input, button, label} from '@motorcycle/dom'
import config from '../../config'

const intent = ({DOM}) => {
  return {
    username$: DOM.select('.username').events('input').map(e => e.target.value),
    password$: DOM.select('.password').events('input').map(e => e.target.value),
    email$: DOM.select('.email').events('input').map(e => e.target.value),
    submit$: DOM.select('.submit').events('click').constant(0)
  }
}

const model = ({username$, password$, email$, submit$}, {url}) => {
  const formValidation = ({username, password, email}) => {
    return username.length > 0
        && password.length > 8
        && email.length > 5
  }
  const form$ = combineArray(
    (username, password, email) => ({username, password, email}),
    [username$, password$, email$]
  )

  const request$ = form$
    .startWith({username: '', password: '', email: ''})
    .sampleWith(submit$)
    .filter(formValidation)
    .map(val => ({
      url: url,
      method: 'POST',
      send: val
    }))

  return {
    request$
  }
}

const view = (state$) => {
  return state$.map(state => {
    return div('.signup', [
      label('.username-label', ['Name:']),
      input('.username', {attrs: {type: 'text', value: 'username'}}),
      // input('.username', {attrs: {type: 'text'}}),
      label('.email-label', ['E-Mail:']),
      input('.email', {attrs: {type: 'email', value: 'a@b.cd'}}),
      // input('.email', {attrs: {type: 'email'}}),
      label('.password-label', ['Password:']),
      input('.password', {attrs: {type: 'password', value: 'password1'}}),
      // input('.password', {attrs: {type: 'password'}}),
      button('.submit', ['Sign Up']),
      div('.message', !state.status ? [] : [
        label('.response', state.status === 'OK'
          ? ['Hi, ' + state.message + ' check your mails.']
          : ['Shit, somthing went wrong: ' + state.message])
      ])
    ])
  })
}

const Init = (sources) => {
  const actions = intent(sources)
  const {request$} = model(actions, {url: config.url.signup})
  // const request$ = just({
  //   url: config.url.signup,
  //   method: 'post',
  //   send: {username: 'username', password: 'password1', email: 'a@b.cd'}
  // });
  const success$ = sources.HTTP
    .filter(res$ => res$.request.url === config.url.signup)
    .join()
    .tap(x => console.log(x))
    .map(res => ({message: res.data[0].username, status: 'OK'}))
  const error$ = sources.HTTP
    .filter(res$ => res$.request.url === config.url.signup)
    .join()
    .recoverWith(err => just({message: err.response.body.message, status: 'FAIL'}))
  const state$ = merge(success$, error$).startWith({})
  const vtree$ = view(state$)
  return {
    DOM: vtree$,
    HTTP: request$,
  }
}

export default Init
