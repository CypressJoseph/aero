/* eslint-disable no-useless-constructor */

import { Observable } from 'rxjs'
import { filter } from 'rxjs/operators'
import { toCamel } from './util'

type AbstractEvent = { kind: string }

export abstract class Story {
  context: any = {}
  abstract name: string;
  abstract correlatedOn: string[];
  abstract startsWith: string;
  abstract endsWith: string;

  protected get prettyContext (): string {
    return Object.entries(this.context).map(([k, v]) => `${k}: ${v}`).join(', ')
  }

  protected log (message: string) { console.log(`${this.name} (${this.prettyContext}): ${message}`) }
}
type StoryTemplate = new () => Story

export class Aero<Event extends AbstractEvent> {
  constructor (public observable: Observable<Event>) {}

  play (...StoryKinds: StoryTemplate[]) {
    for (const StoryKind of StoryKinds) {
      const modelStory = new StoryKind()
      const matchingInitial = filter((e: Event) => e.kind === modelStory.startsWith)
      this.observable.pipe(matchingInitial).forEach(this.relate(StoryKind))
    }
  }

  private relate (StoryKind: StoryTemplate) {
    return (initialEvent: Event) => {
      const story: Story = new StoryKind()
      const { correlatedOn: correlate } = story
      const correlatedEvents = filter((e: Event) => correlate.every((attribute: string) =>
        (initialEvent as any)[attribute] === (e as any)[attribute]
      ))
      const ctx = correlate.map((attr: string) => [attr, (initialEvent as any)[attr]])
      story.context = Object.fromEntries(ctx)
      this.observable.pipe(correlatedEvents).forEach(event => {
        const journeyAction: string = toCamel(event.kind.split(':')[1])
        const eventHandler: Function = (story as any)[journeyAction]
        const missingEventHandler = `warning: missing story event handler for ${event.kind}, e.g.: \n\n    class ${StoryKind.name} { ${journeyAction}() {...} }`
        if (eventHandler) { eventHandler.call(story, event) } else { console.warn(missingEventHandler) }
      })
    }
  }
}
