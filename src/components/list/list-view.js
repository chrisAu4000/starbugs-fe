import {div, button, ul} from '@motorcycle/dom'
import {combineArray, just} from 'most'

const view = (items$) => {
  return items$.map(items => {
    const addButtons = div('.list-buttons', [
      button('.add-list-item', '+')
    ])

    const itemVNodeStreamsByKey = items
      .map(({DOM, id}) => DOM
        .map(vtree => Object.assign({}, vtree, {key: id}))
      )

    return items.length === 0
    ? just(div('.list', [addButtons]))
    : combineArray(
      (...items) => items,
      itemVNodeStreamsByKey
    )
    .map(items => div('.list', [addButtons].concat(ul('.list-ul', items))))
  })
  .switch()
}

export default view
