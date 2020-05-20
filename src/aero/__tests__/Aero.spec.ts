import pkg from '../../../package.json'
import { Observable } from 'rxjs'
import { Aero } from '../Aero'
import { TrialEvent } from '../../examples/test-runner-like/types'
import { ProductStory } from '../../examples/test-runner-like/ProductStory'
import { SpecStory } from '../../examples/test-runner-like/SpecStory'
import { TestStory } from '../../examples/test-runner-like/TestStory'
import { productStore } from '../../examples/test-runner-like/store'

describe(pkg.name, () => {
  const aero: Aero<TrialEvent> = new Aero(new Observable((subscriber) => {
    subscriber.next({ kind: 'product:run-started', productId: 'the-product' })
    subscriber.next({ kind: 'spec:run-started', productId: 'the-product', specId: 'the-spec' })
    subscriber.next({ kind: 'test:run-started', productId: 'the-product', specId: 'the-spec', testId: 'the-test' })
    subscriber.next({ kind: 'test:run-completed', productId: 'the-product', specId: 'the-spec', testId: 'the-test', status: 'pass' })
    subscriber.next({ kind: 'spec:run-completed', productId: 'the-product', specId: 'the-spec', status: 'pass' })
    subscriber.next({ kind: 'product:run-completed', productId: 'the-product', status: 'pass' })
  }))

  beforeEach(() => {
    const stories = [ProductStory, SpecStory, TestStory]
    aero.play(...stories)
    aero.observable.subscribe()
  })

  describe('story', () => {
    it('product', async () => {
      expect(productStore.get('the-product').status).toBe('pass')
    })
    fit('spec', async () => {
      expect(productStore.get('the-product').specs?.length).toBe(1)
      expect(productStore.get('the-product').specs[0].status).toBe('pass')
    })
    it('test', async () => {
      expect(productStore.get('the-product').specs?.length).toBe(1)
      expect(productStore.get('the-product').specs[0].tests?.length).toBe(1)
      expect(productStore.get('the-product').specs[0].tests[0].status).toBe('pass')

      // okay, but why doesn't this get set :D
      // console.log(JSON.stringify(productStore.get('the-product')))
      // expect(productStore.get('the-product').specs[0].status).toBe('pass')
    })
  })
})
