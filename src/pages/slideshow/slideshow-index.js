import {just} from 'most'
import {div} from '@motorcycle/dom'

const Slideshow = () => {
  return {
    DOM: just(
      div('.slideshow', ['Slide'])
    )
  }
}

export default Slideshow
