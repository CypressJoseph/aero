/* eslint-disable no-useless-constructor */
import { Observable } from 'rxjs'
import { filter } from 'rxjs/operators'
import { toCamel } from './util'
import { Story } from './Story'

export type AbstractEvent = { kind: string }
export type StoryTemplate = new () => Story

export class Chronicler<Event extends AbstractEvent> {
  constructor (public observable: Observable<Event>) {}
  study (StoryKind: StoryTemplate) {
    const modelStory = new StoryKind()
    const matchingInitial = filter((e: Event) => e.kind === modelStory.startsWith)
    this.observable.pipe(matchingInitial).forEach(this.relate(StoryKind))
  }

  // create a story from this event and monitor for further developments
  private relate (StoryKind: StoryTemplate) {
    return (initialEvent: Event) => {
      const story: Story = new StoryKind()
      const { correlatedOn: correlate } = story
      const correlatedEvents = filter((e: Event) => correlate.every((attribute: string) =>
        (initialEvent as any)[attribute] === (e as any)[attribute]
      ))
      const correlationIds = correlate.map((attr: string) => [attr, (initialEvent as any)[attr]])
      story.context = Object.fromEntries(correlationIds)
      // todo we want to pipe UNTIL we see the tail/tombstone event..
      // [ie and then forget about this instance of the story *entirely*]
      this.observable.pipe(correlatedEvents).forEach(event => this.route(event, story, StoryKind))
    }
  }

  // send event to this story's handler (or warn handler method missing)
  private route (event: Event, story: Story, storyKind: StoryTemplate) {
    const journeyName = event.kind.split(':')[0]
    if (journeyName !== story.name) { return }
    const journeyAction: string = toCamel(event.kind.split(':')[1])
    const eventHandler: Function = (story as any)[journeyAction]
    if (eventHandler) {
      eventHandler.call(story, event)
    } else {
      const missingEventHandlerMessage = this.missingEventHandlerWarning(
        event.kind,
        storyKind.name,
        journeyAction
      )
      console.warn(missingEventHandlerMessage)
    }
  }

  private missingEventHandlerWarning (kind: string, storyName: string, journeyAction: string) {
    return `[aero] Warning: Missing story event handler for ${kind}, e.g.:\n\n    class ${storyName} { ${journeyAction}() {...} }`
  }
}
