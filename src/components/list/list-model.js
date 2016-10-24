import {holdSubject} from 'most-subject'
import {merge} from 'most'

const model = (actions, wrapper, init) => {
  let mutableLastId = 0

  const createNewItem = (props) => {
    const id = mutableLastId++
    const sinks = wrapper(props, id)
    const rememberedDom$ = holdSubject(1)
    sinks.DOM.observe(x => rememberedDom$.next(x))
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
    // ? [createNewItem({isChecked: false, hasFocus: false, value: ''})]


  return merge(addItem$, removeItem$)
    .scan((items, transformation) => transformation(items), initialState)
    .multicast()
}

export default model
