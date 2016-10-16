const intent = ({DOM}) => {
  return DOM.select('.navigation-list-item-link').events('click').map(e => e.target.text)
}

export default intent
