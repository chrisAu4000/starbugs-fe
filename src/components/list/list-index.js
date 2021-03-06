import {just, mergeArray} from 'most'
import {subject} from 'most-subject'
import isolate from '@cycle/isolate'
import ListItem from '../list-item/list-item-index'
import intent from './list-intent'
import model from './list-model'
import view from './list-view'

const initialState = []
const makeItemWrapper = (sources) => {
  return (props, id) => {
    const propsStreams = {
      isChecked$: just(props.isChecked),
      hasFocus$: just(props.hasFocus),
      value: just(props.value)
    }
    const item = isolate(ListItem)({...sources, props: propsStreams})
    return {
      DOM: item.DOM,
      destroy$: item.actions.destroy$.constant(id)
    }
  }
}

const List = (sources, props) => {
  const itemActions = {destroy$: subject()}
  const actions = intent(sources.DOM, itemActions)
  const itemWrapper = makeItemWrapper(sources)
  const items$ = model(actions, itemWrapper, initialState)
  /* eslint-disable */
  const itemRemove$ = items$
    .chain(items => mergeArray(items.map(item => item.destroy$)))
    .observe(x => itemActions.destroy$.next(x))
  /* eslint-enable */
  const vtree$ = view(items$)
  return {
    DOM: vtree$
  }
}

export default List
