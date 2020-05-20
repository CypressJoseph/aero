import { Subject } from 'rxjs'
import { filter } from 'rxjs/operators'
import { toCamel } from './util'

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
}

export class Aero<Event extends AbstractEvent> {
  private subject: Subject<Event> = new Subject()

  on (kind: string, handle: EventHandler<AbstractEvent>) {
    const stream = this.subject.pipe(filter(event => event.kind === kind))
    stream.subscribe(handle)
  }

  play (StoryKind: new () => Story<Event>) {
    const storyTemplate = new StoryKind()
    const matchesBeginning = filter((e: Event) => e.kind === storyTemplate.startsWith)
    this.subject.pipe(matchesBeginning).forEach((initialEvent: any) => {
      const matchesElements = filter((e: Event) => storyTemplate.correlatedOn.every(
        (correlated: string) => initialEvent[correlated] === e[correlated]
      ))
      const journey: any = new StoryKind()
      const ctx = storyTemplate.correlatedOn.map((attr: string) => [attr, initialEvent[attr]])
      journey.context = Object.fromEntries(ctx)
      this.subject.pipe(matchesElements).forEach(event => {
        const step: string = toCamel(event.kind.split(':')[1])
        const fn: Function = journey[step]
        fn.call(journey, event)
      })
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
