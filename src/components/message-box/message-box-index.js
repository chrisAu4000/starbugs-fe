import {just, merge, combine, delay, from, periodic} from 'most'
import hold from '@most/hold'
import view from './message-box-view'
import model from './message-box-model'
const MessageBox = (sources, prop$, change$ = just((x) => x)) => {

  const state$ = model(prop$, change$)

  return {
    DOM: view(state$)
  }
}

export default MessageBox
