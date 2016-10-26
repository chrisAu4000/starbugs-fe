import {just} from 'most'
import view from './login-view'
import HTTPForm from '../../components/http-form/http-form-index'
import config from '../../config'

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
  return {
    DOM: vtree$,
    HTTP: form.HTTP,
  }
}

export default Login
