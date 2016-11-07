import {li, button, div} from '@motorcycle/dom'

const view = (state$) => {
  return state$.map(({type, message, xdiff = 0}) => {
    return li('.message.' + type, {
      style: {
        transform: 'translateX(' + xdiff + 'px)',
        opacity: xdiff ? '0' : '1',
        transition: 'transform 0.5s, opacity 0.5s'
      }
    }, [
      div('.message-text', [message.length > 100
        ? message.trim().slice(0, 100).concat('...')
        : message.trim()]),
      button('.confirm', ['OK'])
    ])
  })
}

const intent = ({DOM}) => {
  return {
    release$: DOM.select('.confirm').events('click').constant(true)
  }
}

const model = (prop$, {release$}) => {
  return prop$
    .concat(
      release$.constant({xdiff: -700})
    )
    .scan((a, c) => Object.assign({}, a, c), {})
    .filter(x => x.type !== undefined)
}

const MessageConfirm = (sources, prop$) => {
  const actions = intent(sources)
  const state$ = model(prop$, actions)
  return {
    DOM: view(state$),
    action$: actions.release$.delay(500)
  }
}

export default MessageConfirm
