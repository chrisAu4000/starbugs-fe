import {just, combine, throwError} from 'most'

const model = (action$, prop$) => {
  const isPath = (str) => str.charAt(0) === '/'
  const isTitle = (str) => str.indexOf('/', 0) === -1

  console.log(isPath('/login'))
  console.log(isTitle('Signup'))
  console.log(isPath('Signup'))
  console.log(isTitle('/login'))

  const validateInput = (str) => {
    if (typeof str !== 'string') {
      return throwError('The path to navigate to must be a string.')
    }
    console.log(str)
    if (!isPath(str) && !isTitle(str)) {
      return throwError('The string to navigate to is neather a path nor a title.')
    }
    return just(str)
  }
  const toPath = (title, props) => {
    return props
      .filter(prop => prop.title === title)
      .map(prop => prop.href)
      .reduce((a, c) => ({pathname: c}))
  }
  const toTitle = (path, props) => {
    return props
      .filter(prop => prop.href === path)
      .map(prop => prop.title)
      .reduce((_, c) => c)
  }
  const setActive = (route, props) =>
    props.map(prop => Object.assign({}, prop, {active: prop.href === route}))
  const validAction$ = action$.chain(validateInput).multicast()

  const route$ = combine(toPath, validAction$, prop$)
  const state$ = prop$.concat(combine(setActive, route$, prop$))
  return {route$, state$}
}

export default model
