import pkg from '../../../package.json'
import { Aero } from '../Aero'
import { Observable } from 'rxjs'
// eslint-disable-next-line no-unused-vars
import { Event, Ping, Pong } from '../../FakeDomain'
describe(pkg.name, () => {
  // const aggRoot = {}
  const observable: Observable<Event> = new Observable()
  const aero: Aero<Event> = new Aero(observable)
  it('is awesome', () => {
    // expect(aggRoot.products[0].name).toBe('Aero')
    expect(true).toBe(true)
  })

  it('processes events', async () => {
    aero.on(
      'ping',
      (ping: Ping) => aero.dispatch(new Pong())
    )

    await aero.dispatch(new Ping())

    expect(aero.events.length).toBe(2)
    expect(aero.events[1].kind).toBe('pong')
  })
})
