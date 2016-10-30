const intent = ({DOM}) => {
  return DOM
    .select('.navigation-list-item')
    .events('click')
    .map(e => e.currentTarget.textContent)
    .multicast()
}

export default intent
