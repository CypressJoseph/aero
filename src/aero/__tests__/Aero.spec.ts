import pkg from '../../../package.json'
import { Aero } from '../Aero'

// abstract class AbstractEvent { kind: string }
class PingEvent { kind = 'ping' }
class PongEvent { kind = 'pong' }
type Event = PingEvent | PongEvent

describe(pkg.name, () => {
    let aero: Aero<Event> = new Aero()
    it('is awesome', () => { expect(true).toBe(true) })

    it('processes events', async () => {
        aero.on(
            'ping',
            (ping: PingEvent) => aero.dispatch(new PongEvent()) //expect(ping.message).toBe('ping')
        )

        await aero.dispatch(new PingEvent())

        expect(aero.events.length).toBe(2)
        expect(aero.events[1].kind).toBe('pong')
    })
})