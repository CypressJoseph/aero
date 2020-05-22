import { AbstractEvent, Chronicler, StoryTemplate } from './Chronicler'
import { Observable } from 'rxjs'

export class Aero<Event extends AbstractEvent> {
  chronicler: Chronicler<Event>
  constructor (public observable: Observable<Event>) {
    this.chronicler = new Chronicler<Event>(observable)
  }

  play (...StoryKinds: StoryTemplate[]) {
    for (const StoryKind of StoryKinds) {
      this.chronicler.study(StoryKind)
    }
  }
}
