import pkg from '../../../package.json'
import { Observable } from 'rxjs'
import { Aero } from '../Aero'
import { TrialEvent, Product, ProductID, SpecID, TestID, AssertionID } from '../../examples/test-runner-like/types'
import { lookupProduct } from '../../examples/test-runner-like/store'
import { ProductStory, SpecStory, TestStory } from '../../examples/test-runner-like'
import { AssertionStory } from '../../examples/test-runner-like/stories/AssertionStory'
import { simpleRun, productId } from '../../examples/test-runner-like/fixtures'

describe(pkg.name, () => {
  const observable: Observable<TrialEvent> =
    new Observable(sub => simpleRun.forEach(e => sub.next(e)))
  const aero: Aero<TrialEvent> = new Aero(observable)

  let product: Product
  beforeAll(() => {
    const stories = [ProductStory, SpecStory, TestStory, AssertionStory]
    aero.play(...stories)
    aero.observable.subscribe()
    product = lookupProduct(productId)
  })

  describe('story', () => {
    it('product', async () => {
      expect(product.status).toBe('pass')
    })
    it('spec', async () => {
      expect(product.specs?.length).toBe(1)
      expect(product.specs[0].status).toBe('pass')
    })
    it('test', async () => {
      expect(product.specs[0].tests?.length).toBe(1)
      expect(product.specs[0].tests[0].status).toBe('pass')
    })
    it('assert', async () => {
      expect(product.specs[0].tests[0].assertions?.length).toBe(1)
      expect(product.specs[0].tests[0].assertions[0].status).toBe('pass')
      expect(product.specs[0].tests[0].assertions[0].actual).toBe('hello world')
    })
  })
})
