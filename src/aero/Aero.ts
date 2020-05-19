import { Subject } from 'rxjs'

type EventHandler<T> = (event: T) => void

export class Aero<Event extends { kind: string }> {
  constructor (private subject: Subject<Event> = new Subject()) {
    console.log('OBSERVABLE: ' + this.subject)
  }

  on<T extends Event> (kind: string, handle: EventHandler<T>) {
    this.subject.subscribe(event => event.kind === kind && handle(event as T))
  }

  async dispatch<T extends Event> (event: T) {
    this.store(event)
    this.subject.next(event)
    // this.subject.
    // const handler: EventHandler<T> = this.handlers[event.kind] // kind]
    // handler.call(this, event)
  }

    events: Event[] = []
    private store (event: Event) {
      this.events.push(event)
    }

    event (name: string) { throw new Error('[aero] Aero.event not implemented') }
    model (name: string) { throw new Error('[aero] Aero.model not implemented') }
}
