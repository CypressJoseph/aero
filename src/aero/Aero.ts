/* eslint-disable no-useless-constructor */

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

  protected get prettyContext (): string {
    return Object.entries(this.context).map(([k, v]) => `${k}: ${v}`).join(', ')
  }

  protected log (message: string) { console.log(`${this.name} (${this.prettyContext}): ${message}`) }
}
type StoryTemplate = new () => Story

export class Aero<Event extends AbstractEvent> {
  constructor (public observable: Observable<Event>) {}

  fly (pilot: Observer<Event>) { this.observable.subscribe(pilot) }

  play (...StoryKinds: StoryTemplate[]) {
    for (const StoryKind of StoryKinds) {
      const story = new StoryKind()
      const matchesBeginning = filter((e: Event) => e.kind === story.startsWith)
      const handleStoryEvent = (initialEvent: Event) => {
        const matchesElements = filter((e: Event) => story.correlatedOn.every(
          (correlated: string) => (initialEvent as any)[correlated] === (e as any)[correlated]
        ))
        const journey: any = new StoryKind()
        const ctx = story.correlatedOn.map((attr: string) => [attr, (initialEvent as any)[attr]])
        journey.context = Object.fromEntries(ctx)
        this.observable.pipe(matchesElements).forEach(event => {
          const journeyAction: string = toCamel(event.kind.split(':')[1])
          const eventHandler: Function = journey[journeyAction]
          const missingEventHandler = `warning: missing story event handler for ${event.kind}, e.g.: \n\n    class ${StoryKind.name} { ${journeyAction}() {...} }`
          if (eventHandler) { eventHandler.call(journey, event) } else { journey.log(missingEventHandler) }
        })
      }
      this.observable.pipe(matchesBeginning).forEach(handleStoryEvent)
    }
  }
}
