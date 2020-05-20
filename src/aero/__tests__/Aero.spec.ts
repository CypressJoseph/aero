import pkg from '../../../package.json'
import { Aero } from '../Aero'
import { ProductOpened, ProductRunStarted, ProductRunCompleted } from '../../trial/types'
import { ProductStory } from '../../trial/ProductStory'
import { productStore } from '../../trial/store'

export type Event = ProductOpened
                  | ProductRunStarted
                  | ProductRunCompleted

describe(pkg.name, () => {
  const aero: Aero<Event> = new Aero()
  it('saga', async () => {
    // aero.on()

    aero.play(ProductStory)
    expect(Object.entries(productStore).length).toBe(0)
    await aero.dispatch({
      kind: 'product:opened',
      product: {
        id: 12345,
        name: 'Aero',
        specs: [],
        status: 'not-run'
      },
      productId: 12345
    })
    console.log('after open, prod store: ' + JSON.stringify(productStore))
    // TODO expect(productStore['12345'].status).toBe('not-run')
    await aero.dispatch({ kind: 'product:run-started', productId: 12345 })
    expect(productStore['12345'].status).toBe('running')
    await aero.dispatch({ kind: 'product:run-completed', productId: 12345 })
    expect(productStore['12345'].status).toBe('pass')
  })
})
