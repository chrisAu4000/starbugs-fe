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
    messageBox: {
      prop$: just([])
    },
    http: {
      url: config.url.signup,
      method: 'POST'
    },
    validation: (data) => {
      if(data['password'] !== data['verify-password']) {
        return ['Password and verification must be equal.']
      }
      return []
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
