import {just} from 'most'
import {div} from '@motorcycle/dom'

const Slideshow = (sources) => {
  console.log('slideshow')
  // sources.router.history$.observe(console.log)
  return {
    DOM: just(
      div('.slideshow', ['Slide'])
    )
  }
}

export default Slideshow
