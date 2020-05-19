import pkg from '../../../package.json'
import { Aero } from '../Aero'
import { ProductOpened, ProductRunStarted, ProductRunCompleted } from '../../trial/types'
import { ProductStory } from '../../trial/ProductStory'
import { productStore } from '../../trial/store'

export type Event = ProductRunStarted
                  | ProductRunCompleted

describe(pkg.name, () => {
  const aero: Aero<Event> = new Aero()
  it('saga', async () => {
    // let sawStarted = false
    // let sawCompleted = false
    aero.play(ProductStory)
    // 'product:run-started', [], 'product:run-completed', 'productId', (event, ctx) => {
    //   if (event.kind === 'product:run-started') { sawStarted = true }
    //   if (event.kind === 'product:run-completed') { sawCompleted = true }
    // })
    // await aero.dispatch({ kind: 'product:run-started', productId: 12345 })
    await aero.dispatch({ kind: 'product:run-started', productId: 12345 })
    await aero.dispatch({ kind: 'product:run-completed', productId: 12345 })

    console.log(productStore)
    expect(productStore['12345'].status).toBe('pass')
    // expect(sawStarted).toBe(true)
    // expect(sawCompleted).toBe(true)
  })
})
