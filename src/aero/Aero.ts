import { Observable } from 'rxjs'

type EventHandler<T> = (event: T) => void

export class Aero<Event extends { kind: string }> {
  constructor (private observable: Observable<Event>) {
    console.log('OBSERVABLE: ' + this.observable)
  }

  on<T extends Event> (kind: string, handler: EventHandler<T>) {
    this.registerHandler(kind, handler)
    // let handlerPipe = this.observable.filter((event: T) => event.kind === kind)
  }

  async dispatch<T extends Event> (event: T) {
    this.store(event)
    const handler: EventHandler<T> = this.handlers[event.kind] // kind]
    handler.call(this, event)
  }

    handlers: { [kind: string]: EventHandler<any> } = {}
    private registerHandler<T extends Event> (kind: string, handler: EventHandler<T>) {
      this.handlers[kind] = handler
    }

    events: Event[] = []
    private store (event: Event) {
      this.events.push(event)
    }

    event (name: string) { throw new Error('[aero] Aero.event not implemented') }
    model (name: string) { throw new Error('[aero] Aero.model not implemented') }
}
