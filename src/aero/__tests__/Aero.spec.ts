import pkg from '../../../package.json'
import { Aero } from '../Aero'
import { TrialEvent } from '../../trial/types'
import { ProductStory } from '../../trial/ProductStory'
import { productStore } from '../../trial/store'
import { Observable } from 'rxjs'
import { SpecStory } from '../../trial/SpecStory'

const noop = () => {}

describe(pkg.name, () => {
  const aero: Aero<TrialEvent> = new Aero(new Observable((subscriber) => {
    subscriber.next({ kind: 'product:opened', productId: 'the-product' })
    subscriber.next({ kind: 'product:run-started', productId: 'the-product' })
    subscriber.next({ kind: 'spec:run-started', productId: 'the-product', specId: 'the-spec' })
    subscriber.next({ kind: 'spec:run-completed', productId: 'the-product', specId: 'the-spec', status: 'pass' })
    subscriber.next({ kind: 'product:run-completed', productId: 'the-product', status: 'pass' })
  }))
  const fly = () => aero.fly({ next: noop, error: noop, complete: noop })

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
  })
})
