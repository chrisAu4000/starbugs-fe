import {just} from 'most';
import {div, button, input} from '@motorcycle/dom';

const Login = (sources) => {
  return {
    DOM: just(
      div('.login-form', [
        input('.username', {attrs: {type: 'text', placeholder: 'Name'}}),
        input('.password', {attrs: {type: 'password', placeholder: 'Password'}}),
        button('.submit', ['Login'])
      ])
    )
  }
}

export default Login
