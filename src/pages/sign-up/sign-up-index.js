import {just, combineArray, merge, combine} from 'most'
import config from '../../config'
import HTTPForm from '../../components/http-form/http-form-index'
import view from './sign-up-view'

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
    messageBox: {
      prop$: just([])
    },
    http: {
      url: config.url.signup,
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

export default Init
