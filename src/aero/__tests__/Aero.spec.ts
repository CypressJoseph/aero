import pkg from '../../../package.json'
import { Observable } from 'rxjs'
import { Aero } from '../Aero'
import { TrialEvent, Product, ProductID, SpecID, TestID, AssertionID } from '../../examples/test-runner-like/types'
import { lookupProduct } from '../../examples/test-runner-like/store'
import { ProductStory, SpecStory, TestStory } from '../../examples/test-runner-like'
import { AssertionStory } from '../../examples/test-runner-like/AssertionStory'

const productId: ProductID = 'the-product' as ProductID
const specId: SpecID = 'the-spec' as SpecID
const testId: TestID = 'the-test' as TestID
const assertId: AssertionID = 'the-assertion' as AssertionID

describe(pkg.name, () => {
  const aero: Aero<TrialEvent> = new Aero(new Observable((subscriber) => {
    subscriber.next({ kind: 'product:run-started', productId })
    subscriber.next({ kind: 'spec:run-started', productId, specId })
    subscriber.next({ kind: 'test:run-started', productId, specId, testId })
    subscriber.next({ kind: 'assert:run-started', productId, specId, testId, assertionId: assertId })
    subscriber.next({ kind: 'assert:run-completed', productId, specId, testId, assertionId: assertId, status: 'pass' })
    subscriber.next({ kind: 'test:run-completed', productId, specId, testId, status: 'pass' })
    subscriber.next({ kind: 'spec:run-completed', productId, specId, status: 'pass' })
    subscriber.next({ kind: 'product:run-completed', productId, status: 'pass' })
  }))

  let product: Product
  beforeEach(() => {
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
    })
  })
})
