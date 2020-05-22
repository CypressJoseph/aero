
/* eslint-disable no-useless-constructor */
import { Observable, throwError, of, OperatorFunction } from 'rxjs'
import { filter, takeWhile, timeout, catchError } from 'rxjs/operators'
import { toCamel } from './util'
import { Story } from './Story'
import Pino from 'pino'

export type AbstractEvent = { kind: string }
export type StoryTemplate = new () => Story

export class Chronicler<Event extends AbstractEvent> {
  log: Pino.Logger

  constructor (public observable: Observable<Event>) {
    this.log = Pino({ name: 'aero', prettyPrint: true })
  }

  study (StoryKind: StoryTemplate) {
    const modelStory = new StoryKind()
    const matchingInitial = filter((e: Event) => e.kind === modelStory.startsWith)
    this.observable.pipe(matchingInitial).forEach(this.relate(StoryKind))
  }

  // create a story from this event and monitor for further developments
  private relate (StoryKind: StoryTemplate) {
    const modelStory = new StoryKind()
    const { correlatedOn: correlate } = modelStory
    return async (initialEvent: Event) => {
      const startedAt = new Date().getTime()
      const story: Story = new StoryKind()
      const correlationIds = correlate.map((attr: string) => [attr, (initialEvent as any)[attr]])
      story.context = Object.fromEntries(correlationIds)
      const log = this.log.child({ story: StoryKind.name, ...story.context })
      const timely = timeout<Event>(story.timeout)
      const correlatedEvents = filter((e: Event) => correlate.every((attribute: string) =>
        (initialEvent as any)[attribute] === (e as any)[attribute]
      ))
      const untilItIsDone = takeWhile((event: Event) => event.kind !== story.endsWith, true)
      const withFriendlyTimeouts: OperatorFunction<Event, Event> = catchError((err) => {
        log.warn(`timed out waiting for ${story.endsWith} (${story.timeout}ms elapsed)`)
        return throwError(err)
      })
      const plot = this.observable.pipe(
        timely, correlatedEvents, untilItIsDone,
        withFriendlyTimeouts
      )
      let timedOut = false
      await plot.forEach(event => {
        log.debug(event.kind)
        this.route(event, story, StoryKind)
      }).catch(e => { timedOut = true; throwError(e) })
      if (!timedOut) {
        const finishedAt = new Date().getTime()
        const elapsed = finishedAt - startedAt
        log.debug(`${StoryKind.name} finished in ${elapsed}ms`)
      }
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
      this.log.warn(missingEventHandlerMessage)
    }
  }

  private missingEventHandlerWarning (kind: string, storyName: string, journeyAction: string) {
    return `Missing story event handler for ${kind}, e.g.:\n\n    class ${storyName} { ${journeyAction}() {...} }`
  }
}
