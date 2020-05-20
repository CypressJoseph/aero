import { Subject, Observable, Observer } from 'rxjs'
import { filter } from 'rxjs/operators'
import { toCamel } from './util'

type AbstractEvent = { kind: string } // ; [attr: string]: any }
type EventHandler<T> = (event: T) => void

export abstract class Story<T> {
  context: any = {}
  abstract name: string;
  abstract correlatedOn: string[];
  abstract startsWith: string;
  abstract endsWith: string;
  abstract respondsTo: string[];
}

export class Aero<Event extends AbstractEvent> {
  // eslint-disable-next-line no-useless-constructor
  constructor (public observable: Observable<Event>) {}

  fly (pilot: Observer<Event>) { this.observable.subscribe(pilot) }

  on (kind: string, handle: EventHandler<AbstractEvent>) {
    const stream = this.observable.pipe(filter(event => event.kind === kind))
    stream.subscribe(handle)
  }

  play (StoryKind: new () => Story<Event>) {
    const storyTemplate = new StoryKind()
    const matchesBeginning = filter((e: Event) => e.kind === storyTemplate.startsWith)
    this.observable.pipe(matchesBeginning).forEach((initialEvent: any) => {
      const matchesElements = filter((e: Event) => storyTemplate.correlatedOn.every(
        (correlated: string) => initialEvent[correlated] === (e as any)[correlated]
      ))
      const journey: any = new StoryKind()
      const ctx = storyTemplate.correlatedOn.map((attr: string) => [attr, initialEvent[attr]])
      journey.context = Object.fromEntries(ctx)
      this.observable.pipe(matchesElements).forEach(event => {
        const step: string = toCamel(event.kind.split(':')[1])
        const fn: Function = journey[step]
        if (fn) { fn.call(journey, event) } else { journey.log(`warning: missing story event handler for ${event.kind} -- ${step}() {...}`) }
      })
    })
  }
}
