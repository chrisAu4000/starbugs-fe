
const intent = ({DOM}) => {
  return {
    username$: DOM.select('.username').events('input').map(e => e.target.value),
    password$: DOM.select('.password').events('input').map(e => e.target.value),
    submit$: DOM.select('.submit').events('click').constant(null)
  }
}

export default intent;
