import {div, ul, li, nav, a} from '@motorcycle/dom'

const view = (prop$) => {
  return prop$.map(props =>
    nav([
      ul('.navigation-list', props.map(p =>
        li('.navigation-list-item' + (p.active ? '.active' : ''), [
          div('.navigation-list-tc', [
            a('.navigation-list-item-link',
              {attrs: {data: p.href}},
              [p.title]
            )
          ])
        ]))
      )
    ])
  )
}

export default view
