import pkg from '../../../package.json'
import { Aero } from '../Aero'
import { Event } from '../../FakeDomain'

describe(pkg.name, () => {
  const aero: Aero<Event> = new Aero()
  it('saga', async () => {
    let sawStarted = false
    let sawCompleted = false
    aero.saga('product:run-started', [], 'product:run-completed', 'productId', (event) => {
      if (event.kind === 'product:run-started') { sawStarted = true }
      if (event.kind === 'product:run-completed') { sawCompleted = true }
    })
    await aero.dispatch({ kind: 'product:run-started', productId: 12345 })
    await aero.dispatch({ kind: 'product:run-completed', productId: 12345 })
    expect(sawStarted).toBe(true)
    expect(sawCompleted).toBe(true)
  })
})
