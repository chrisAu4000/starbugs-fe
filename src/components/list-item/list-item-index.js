import model from './list-item-model'
import view from './list-item-view'
import intent from './list-item-intent'

const ListItem = (sources) => {
  const actions = intent(sources)
  const state$ = model(actions, sources.props)
  const view$ = view(state$)
  return {
    DOM: view$,
    actions: actions
  }
}

export default ListItem
