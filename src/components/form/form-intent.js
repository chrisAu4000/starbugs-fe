import {objOf} from 'ramda'
const intent = ({DOM}, props) => {
  return props.inputs.reduce((a, c) => {
    return Object.assign({}, a, {inputs: Array.prototype.concat(a.inputs, [
        DOM.select('.' + c.classname)
          .events('input')
          .map(e => objOf(c.classname, e.target.value))
      ]
    )})
  }, {
    submit$: DOM.select('.submit').events('click').constant(1),
    inputs: []
  })
}

export default intent;
