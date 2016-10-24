import {delay, just} from 'most'
import model from './login-model'
import view from './login-view'
import intent from './login-intent'
import HTTPForm from '../../components/http-form/http-form-index'
import config from '../../config'
/*
States:
initial: {disabled: false, errors: [], success: [], spinner: false}
loading: {disabled: true, errors: [], success: [], , spinner: true}
Error: {disabled: false, errors: [''...], success: [], spinner: false}
success: {disabled: true, errors: [], success: String, spinner: false}
*/
const Login = (sources) => {
  const formProp$ = just({
    inputs: [
      {as: 'username', prop$: just({disabled: false, placeholder: 'Username', type: 'text', value: ''})},
      {as: 'password', prop$: just({disabled: false, placeholder: 'Password', type: 'password', value: ''})}
    ],
    messageBox: {
      prop$: just([])
    },
    button: {
      prop$: just({disabled: false, spinner: false, label: 'Sign In'})
    },
    http: {
      url: config.url.login,
      method: 'POST'
    }
  })

  const form = HTTPForm(sources, formProp$)
  const vtree$ = view(form.DOM.map(dom => ({form: dom})))
  // const initialState$ = just({
  //   disabled: false,
  //   errors: [],
  //   success: [],
  //   spinner: false
  // });
  //
  // const actions = intent(sources);
  // const {state$, request$} = model({
  //   ...actions,
  //   http$: sources.HTTP
  // }, initialState$);
  //
  // const vtree$ = view(state$);
  return {
    DOM: vtree$,
    HTTP: form.HTTP,
  }
}

export default Login
