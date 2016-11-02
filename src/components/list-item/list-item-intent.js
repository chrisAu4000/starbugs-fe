
const intent = ({DOM}) => {
  return {
    updateContent$: DOM.select('.list-item-input').events('input')
      .map(e => e.target.value),
    destroy$: DOM.select('.delete-item').events('click')
      .constant(true),
    enterPressed$: DOM.select('.list-item-input').events('keypress')
      .filter(e => e.key === 'Enter')
      .constant(true),
    saveContent$: DOM.select('.save-item').events('click')
      .constant(true),
    focus$: DOM.select('.list-item-input').events('focus').constant(true),
    unfocus$: DOM.select('.list-item-input').events('focusout').constant(false)
  }
}

export default intent
