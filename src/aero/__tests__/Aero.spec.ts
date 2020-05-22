import pkg from '../../../package.json'
import { Observable } from 'rxjs'
import { Aero } from '../Aero'
import { TrialEvent, Product } from '../../examples/test-runner-like/types'
import { lookupProduct } from '../../examples/test-runner-like/store'
import { ProductStory, SpecStory, TestStory } from '../../examples/test-runner-like'
import { AssertionStory } from '../../examples/test-runner-like/stories/AssertionStory'
import { simpleRun, productId } from '../../examples/test-runner-like/fixtures'

describe(pkg.name, () => {
  const observable: Observable<TrialEvent> =
    new Observable(sub => simpleRun.forEach(e => sub.next(e)))
  const aero: Aero<TrialEvent> = new Aero(observable)

  let product: Product
  beforeAll(async done => {
    const stories = [ProductStory, SpecStory, TestStory, AssertionStory]
    aero.play(...stories)
    aero.observable.subscribe()
    product = lookupProduct(productId)
    await new Promise(resolve => setTimeout(resolve, 250))
    done()
  })

  describe('story', () => {
    it('product', () => { expect(product.status).toBe('pass') })
    it('spec', () => { expect(product.specs[0].status).toBe('pass') })
    it('test', () => { expect(product.specs[0].tests[0].status).toBe('pass') })
    it('assert', () => {
      expect(product.specs[0].tests[0].assertions[0].status).toBe('pass')
      expect(product.specs[0].tests[0].assertions[0].actual).toBe('hello world')
    })
  })
})
