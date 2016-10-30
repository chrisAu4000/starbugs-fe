import {combine} from 'most'

const model = (action$, prop$) => {
  const toPath = (title, props) => {
    return props.filter(prop => prop.title === title)
      .map(prop => prop.href)
      .reduce((a, c) => ({pathname: c}))
  }
  const setActive = (title, props) =>
    props.map(prop => Object.assign({}, prop, {active: prop.title === title}))
  const route$ = combine(toPath, action$, prop$)
  const state$ = prop$.concat(combine(setActive, action$, prop$))
  return {route$, state$}
}

export default model
