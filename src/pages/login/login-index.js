import {just} from 'most'
import {div, button, input, h, svg} from '@motorcycle/dom'
import {delay} from 'most'
import model from './login-model'
import view from './login-view'
import intent from './login-intent'
import config from '../../config'

/*
States:
initial: {disabled: false, errors: [], success: [], spinner: false}
loading: {disabled: true, errors: [], success: [], , spinner: true}
Error: {disabled: false, errors: [''...], success: [], spinner: false}
success: {disabled: true, errors: [], success: String, spinner: false}
*/
const Login = (sources) => {
  const initialState$ = just({
    disabled: false,
    errors: [],
    success: [],
    spinner: false
  });


  const actions = intent(sources);
  const {state$, request$} = model({
    ...actions,
    http$: sources.HTTP
  }, initialState$);

  const route$ = delay(1000, state$
    .filter(state => state.success)
    .filter(state => state.success.length > 0)
    .constant('/'))

  const vtree$ = view(state$);
  return {
    DOM: vtree$,
    HTTP: request$,
    router: route$,
  }
}

export default Login
