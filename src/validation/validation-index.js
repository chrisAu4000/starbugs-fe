import {curry} from 'ramda'

const username = (data) => {
  return data['username'].length < 2 ||
         data['username'].length > 39
       ? 'Username must be between 2 and 39 characters.'
       : ''
}

const email = (data) => {
  return data['email'].length < 5 ||
         data['email'].length > 254
       ? 'E-Mail must be between 5 and 254 characters.'
       : ''
}

const password = (data) => {
  return data['password'].length < 8 ||
         data['password'].length > 39
       ? 'Password must be between 8 and 39 characters.'
       : ''
}

const passwordVerification = (data) => {
  return data['password'] !== data['verify-password']
       ? 'Password and verification must be equal.'
       : ''
}
const validations = {username, email, password, passwordVerification}

const validate = curry((fns, data) => {
  return fns
    .map(fnName => validations[fnName])
    .filter(x => x.length !== 0)
    .reduce((a, fn) => {
      const validationMessage = fn(data)
      return validationMessage
        ? Array.prototype.concat(a, [validationMessage])
        : a
    }, [])
})

export {validate}
