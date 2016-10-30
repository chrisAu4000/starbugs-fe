import {curry} from 'ramda'

const username = (data) => {
  if(data['username'].length < 2 || data['username'].length > 39) {
    return 'Username must be between 2 and 39 characters.'
  }
}

const email = (data) => {
  if(data['email'].length < 5 || data['email'].length > 254) {
    return 'E-Mail must be between 5 and 254 characters.'
  }
}

const password = (data) => {
  if(data['password'].length < 8 || data['password'].length > 39) {
    return 'Password must be between 8 and 39 characters.'
  }
}

const passwordVerification = (data) => {
  if(data['password'] !== data['verify-password']) {
    return 'Password and verification must be equal.'
  }
}
const validations = {username, email, password, passwordVerification}

const validate = curry((fns, data) => {
  return fns
    .map(fnName => validations[fnName])
    .filter(x => x !== undefined)
    .reduce((a, fn) => {
      const validationMessage = fn(data)
      return validationMessage
        ? Array.prototype.concat(a, [validationMessage])
        : a
    }, [])
})

export {validate}
