import pkg from '../../../package.json'
import { Aero } from '../Aero'

export class Ping { kind = 'ping' }
export class Pong { kind = 'pong' }
type Event = Ping | Pong

describe(pkg.name, () => {
  const aero: Aero<Event> = new Aero()
  it('events', async () => {
    aero.on(
      'ping',
      (_ping: Ping) => aero.dispatch(new Pong())
    )

    await aero.dispatch(new Ping())
    expect(aero.events.length).toBe(2)
    expect(aero.events[1].kind).toBe('pong')
  })
})
