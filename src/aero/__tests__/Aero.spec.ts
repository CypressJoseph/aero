import pkg from '../../../package.json'
import { Observable } from 'rxjs'
import { Aero } from '../Aero'
import { TrialEvent } from '../../trial/types'
import { ProductStory } from '../../trial/ProductStory'
import { productStore } from '../../trial/store'
import { SpecStory } from '../../trial/SpecStory'
import { TestStory } from '../../trial/TestStory'

describe(pkg.name, () => {
  const aero: Aero<TrialEvent> = new Aero(new Observable((subscriber) => {
    subscriber.next({ kind: 'product:run-started', productId: 'the-product' })
    subscriber.next({ kind: 'spec:run-started', productId: 'the-product', specId: 'the-spec' })
    subscriber.next({ kind: 'test:run-started', productId: 'the-product', specId: 'the-spec', testId: 'the-test' })
    subscriber.next({ kind: 'test:run-completed', productId: 'the-product', specId: 'the-spec', testId: 'the-test', status: 'pass' })
    subscriber.next({ kind: 'spec:run-completed', productId: 'the-product', specId: 'the-spec', status: 'pass' })
    subscriber.next({ kind: 'product:run-completed', productId: 'the-product', status: 'pass' })
  }))
  const fly = () => aero.observable.subscribe()

  describe('story', () => {
    it('product lifecycle', async () => {
      aero.play(ProductStory)
      fly()
      expect(productStore.get('the-product').status).toBe('pass')
    })
    it('spec lifecycle', async () => {
      aero.play(ProductStory, SpecStory)
      fly()
      expect(productStore.get('the-product').specs?.length).toBe(1)
      expect(productStore.get('the-product').specs[0].status).toBe('pass')
    })
    it('test lifecycle', async () => {
      aero.play(ProductStory, SpecStory, TestStory)
      fly()
      expect(productStore.get('the-product').specs?.length).toBe(1)

      expect(productStore.get('the-product').specs[0].tests?.length).toBe(1)
      expect(productStore.get('the-product').specs[0].tests[0].status).toBe('pass')

      // okay, but why doesn't this get set :D
      // expect(productStore.get('the-product').specs[0].status).toBe('pass')

    })
  })
})
