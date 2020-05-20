import { Observable, Observer } from 'rxjs'
import { filter } from 'rxjs/operators'
import { toCamel } from './util'

type AbstractEvent = { kind: string }

export abstract class Story {
  context: any = {}
  abstract name: string;
  abstract correlatedOn: string[];
  abstract startsWith: string;
  abstract endsWith: string;
  abstract respondsTo: string[];

  protected log (message: string) { console.log(`${this.name} [${JSON.stringify(this.context)}]: ${message}`) }
}

export class Aero<Event extends AbstractEvent> {
  // eslint-disable-next-line no-useless-constructor
  constructor (public observable: Observable<Event>) {}

  fly (pilot: Observer<Event>) { this.observable.subscribe(pilot) }

  play (StoryKind: new () => Story) {
    const storyTemplate = new StoryKind()
    const matchesBeginning = filter((e: Event) => e.kind === storyTemplate.startsWith)
    const handleStoryEvent = (initialEvent: Event) => {
      const matchesElements = filter((e: Event) => storyTemplate.correlatedOn.every(
        (correlated: string) => (initialEvent as any)[correlated] === (e as any)[correlated]
      ))
      const journey: any = new StoryKind()
      const ctx = storyTemplate.correlatedOn.map((attr: string) => [attr, (initialEvent as any)[attr]])
      journey.context = Object.fromEntries(ctx)
      this.observable.pipe(matchesElements).forEach(event => {
        const step: string = toCamel(event.kind.split(':')[1])
        const fn: Function = journey[step]
        if (fn) { fn.call(journey, event) } else { journey.log(`warning: missing story event handler for ${event.kind} -- ${step}() {...}`) }
      })
    }
    this.observable.pipe(matchesBeginning).forEach(handleStoryEvent)
  }
}
