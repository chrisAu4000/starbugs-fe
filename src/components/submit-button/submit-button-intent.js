const intent = ({DOM}) => {
  return DOM.select('.submit').events('click').constant(true)
}
export default intent
