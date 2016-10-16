import {combine} from 'most'

const model = (action$, prop$) => {
  return combine((title, props) => {
    return props
      .filter(prop => prop.title === title)
      .map(prop => prop.href)
      .reduce((a, c) => ({pathname:c}))
  }
  , action$
  , prop$)
}

export default model
