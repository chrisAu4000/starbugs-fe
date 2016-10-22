import {combine, mergeArray, just} from 'most'
import config from '../../config'

const model = ({username$, password$, submit$, http$}, init$) => {
  const reqEquals = (a, b) => a.username === b.username &&
                              a.password === b.password
  const toRequest = (data) => ({
    url: config.url.login,
    method: 'POST',
    send: data
  })
  const handleBadRequest$ = (res$) =>
    res$.recoverWith(err => just({body: {message: err.message}}))
  const loadingState = {
    errors: [],
    success: [],
    disabled: true,
    spinner: true,
  }
  const toErrorState = (message) => ({
    errors: [message],
    success: [],
    disabled: false,
    spinner: false,
  })
  const toSuccessState = (message) => ({
    errors: [],
    success: [message],
    disabled: true,
    spinner: false,
  })
  const request$ = combine(
      (username, password) => ({username, password}),
      username$,
      password$
    )
    .sampleWith(submit$)
    .skipRepeats(reqEquals)
    .map(toRequest)
  const response$ = http$
    .filter(res$ => res$.request.url === config.url.login)
    .map(handleBadRequest$)
    .join()
  const success$ = response$
    .filter(res => res.status === 200)
    .map(toSuccessState)
  const error$ = response$
    .filter(res => res.status !== 200)
    .filter(res => res.body.message.length > 0)
    .map(res => res.body.message)
    .map(toErrorState)
  const update$ = mergeArray([request$.constant(loadingState), success$, error$])
  const state$ = init$.concat(update$)
  return {state$, request$};
}

export default model
