import {just, combine, throwError} from 'most'

const model = (action$, prop$) => {
  const isPath = (str) => str.charAt(0) === '/'
  const isTitle = (str) => str.indexOf('/', 0) === -1
  const validateInput = (str) => {
    /* eslint-disable */
    if (typeof str !== 'string') {
      return throwError('The path to navigate to must be a string.')
    }
    if (!isPath(str) && !isTitle(str)) {
      return throwError('The string to navigate to is neather a path nor a title.')
    }
    /* eslint-enable */
    return just(str)
  }
  const toPath = (title, props) => {
    return props
      .filter(prop => prop.title === title)
      .map(prop => prop.href)
      .reduce((a, c) => ({pathname: c}))
  }
  const setActive = (route, props) =>
    props.map(prop => Object.assign({}, prop, {active: prop.href === route}))
  const validAction$ = action$.multicast().chain(validateInput)
  const route$ = combine(toPath, validAction$, prop$)
  const state$ = prop$.concat(combine(setActive, route$, prop$))
  return {route$, state$}
}

export default model
