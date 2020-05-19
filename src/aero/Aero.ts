import { Subject } from 'rxjs'

type AbstractEvent = { kind: string; [attr: string]: any }

type EventHandler<T> = (event: T) => void

type SagaContext<T> = { eventLog: T[] }
type SagaHandler<T> = (event: T, ctx?: SagaContext<T>) => void

export class Aero<Event extends AbstractEvent> {
  private subject: Subject<Event> = new Subject()

  on<T extends Event> (kind: string, handle: EventHandler<T>) {
    this.subject.subscribe(event => event.kind === kind && handle(event as T))
  }

  saga<T extends Event> (
    startEvent: string,
    watchEvents: string[],
    stopEvent: string,
    attr: string,
    handleSagaEvent: SagaHandler<T>
  ) {
    const sagaCtx: SagaContext<T> = { eventLog: [] }
    const sagaHandler = (correlationId: string) => (sagaEvent: T) => {
      const eventCorrelationId: string = sagaEvent[attr]
      const correlated: boolean = eventCorrelationId === correlationId
      if (correlated) {
        const monitored: string[] = [startEvent, ...watchEvents, stopEvent]
        if (monitored.includes(sagaEvent.kind)) {
          handleSagaEvent(sagaEvent as T, sagaCtx)
        } else if (sagaEvent.kind === stopEvent) {
          console.warn('[saga-handler] should unsub?')
        }
      }
    }
    this.subject.subscribe(e => {
      console.log(`[saga-manager] checking event: ${e.kind}`)
      if (e.kind === startEvent) {
        const handle: EventHandler<Event> = sagaHandler(e[attr]) as EventHandler<Event>
        handle(e as T)
        this.subject.subscribe(handle)
      }
    })
  }

  async dispatch<T extends Event> (event: T) {
    this.store(event)
    this.subject.next(event)
  }

  events: Event[] = []
  private store (event: Event) {
    this.events.push(event)
  }
}
