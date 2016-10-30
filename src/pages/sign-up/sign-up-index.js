import {just, combineArray, merge, combine} from 'most'
import config from '../../config'
import HTTPForm from '../../components/http-form/http-form-index'
import MessageBox from '../../components/message-box/message-box-index'
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
    http: {
      url: config.url.signup,
      method: 'POST'
    },
    validation: (data) => {
      const errors = [];
      if(data['username'].length < 2 || data['username'].length > 39) {
        errors.push('Username must be between 2 and 39 characters.')
      }
      if(data['email'].length < 5 || data['email'].length > 254) {
        errors.push('E-Mail must be between 5 and 254 characters.')
      }
      if(data['password'].length < 8 || data['password'].length > 39) {
        errors.push('Password must be between 8 and 39 characters.')
      }
      if(data['password'] !== data['verify-password']) {
        errors.push('Password and verification must be equal.')
      }
      return errors
    }
  })
  const form = HTTPForm(sources, formProp$)
  const messageBox = MessageBox(sources, just([]), form.messages$.map(m => _ => m))
  const dom$ = combine(
    (form, messageBox) => ({form, messageBox}),
    form.DOM,
    messageBox.DOM
  )
  const vtree$ = view(dom$)
  return {
    DOM: vtree$,
    HTTP: form.HTTP,
  }
}

export default Init
