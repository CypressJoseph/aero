import pkg from '../../../package.json'
import { Aero } from '../Aero'
import { ProductOpened, ProductRunStarted, ProductRunCompleted } from '../../trial/types'
import { ProductStory } from '../../trial/ProductStory'
import { productStore } from '../../trial/store'
import { Observable } from 'rxjs'

export type Event = ProductOpened
                  | ProductRunStarted
                  | ProductRunCompleted

describe(pkg.name, () => {
  const aero: Aero<Event> = new Aero(new Observable((subscriber) => {
    subscriber.next({ kind: 'product:opened', productId: 'the-product' })
    subscriber.next({ kind: 'product:run-started', productId: 'the-product' })
    subscriber.next({ kind: 'product:run-completed', productId: 'the-product' })
  }))

  it('saga', async () => {
    aero.play(ProductStory)
    aero.fly({
      next: event => console.log(event.kind),
      error: error => console.log(error),
      complete: () => console.log('complete')
    })
    expect(productStore.get('the-product').status).toBe('pass')
  })
})
