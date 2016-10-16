const intent = (DOM, itemActions) => {
  const add$ = DOM.select('.add-list-item').events('click').constant(1)
  const remove$ = itemActions.destroy$
  return { add$, remove$ }
}

export default intent
