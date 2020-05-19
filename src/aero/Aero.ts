import { Subject } from 'rxjs'
import { filter } from 'rxjs/operators'

const toCamel = (s: string) => {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '')
  })
}

type AbstractEvent = { kind: string; [attr: string]: any }

type EventHandler<T> = (event: T) => void

type SagaContext<T> = { eventLog: T[] }
type SagaHandler<T> = (event: T, ctx?: SagaContext<T>) => void

export abstract class Story<T> {
  context: any = {}
  abstract name: string;
  abstract correlatedOn: string[];
  abstract startsWith: string;
  abstract respondsTo: string[];
  // eslint-disable-next-line no-useless-constructor
  constructor () {}
  // public journey (e: T): Saga<T> { return {} }
}

export class Aero<Event extends AbstractEvent> {
  private subject: Subject<Event> = new Subject()

  on<T extends Event> (kind: string, handle: EventHandler<T>) {
    this.subject.subscribe(event => event.kind === kind && handle(event as T))
  }

  // sagas: Saga<Event>[] = []
  play (StoryKind: new () => Story<Event>) {
    const storyTemplate = new StoryKind()
    console.log('PLAY ' + storyTemplate.name)
    const matchesBeginning = filter((e: Event) => e.kind === storyTemplate.startsWith)
    this.subject.pipe(matchesBeginning).subscribe((event: any) => { // hm
      console.log('--> beginning of story found: ' + storyTemplate.name + ' / ' + event.kind)
      const matchesElements = filter((e: Event) => storyTemplate.correlatedOn.every(
        (correlated: string) => event[correlated] === e[correlated]
      ))

      const journey: any = new StoryKind()
      this.subject.pipe(matchesElements).forEach(event => {
        const step: string = toCamel(event.kind.split(':')[1])
        console.log('STEP: ' + step)
        const fn: Function = journey[step]
        fn.call(journey, event)
      })
      // sto
      // saga.unfold(this.subject)

      // event
      // this.subject.
      // this.sagas.push(saga)
    })
    // this.subject.subscribe(event => {
    //   if (story.startsWith === event.kind) {
    //     this.sagas.push(saga)
    //   }

    //   for (let i = 0; i < this.sagas.length; i++) {
    //     const saga = this.sagas[i]
    //     let relevant = saga.story.respondsTo.includes(event.kind)
    //     if (relevant) {
    //       // are we correlated?

    //     }
    //   }
    // })
  }

  story<T extends Event> (
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
          // todo unsubscribe...?
        }
      }
    }
    this.subject.subscribe(e => {
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
