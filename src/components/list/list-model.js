import {holdSubject} from 'most-subject'
import {merge} from 'most'

const model = (actions, wrapper, init) => {
  /* eslint-disable fp/no-let */
  let mutableLastId = 0
  /* eslint-enable */
  const createNewItem = (props) => {
    /* eslint-disable fp/no-mutation */
    const id = mutableLastId++
    const sinks = wrapper(props, id)
    const rememberedDom$ = holdSubject(1)
    sinks.DOM.observe(x => rememberedDom$.next(x))
    /* eslint-enable */
    return {id, DOM: rememberedDom$, destroy$: sinks.destroy$}
  }

  const addItem$ = actions.add$.map(() => {
    const item = createNewItem({isChecked: false, hasFocus: false, value: ''})
    return (items) => {
      return Array.prototype.concat([], items, [item])
    }
  })

  const removeItem$ = actions.remove$.map(id => {
    return (items) => {
      return items.filter(item => item.id !== id)
    }
  })

  const initialState = init.map((props) => createNewItem(props))

  return merge(addItem$, removeItem$)
    .scan((items, transformation) => transformation(items), initialState)
    .multicast()
}

export default model
