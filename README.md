# aerolith

## Synopsis

Microframework for correlating events from observables

## Stories

The core model is a `Story` object that describes the ongoing 'journey' of a domain model
as events are processed

We route events to matching story methods, given the event correlates the attributes that the story model specifies.

The story ends up looking something like a domain controller:

```typescript
import { Story } from 'aerolith'
export class TestStory extends Story {
    name = 'test'
    correlatedOn = ['productId', 'specId', 'testId']
    startsWith = 'test:run-started'
    endsWith = 'test:run-completed'

    runStarted () {}

    runCompleted (e: RunCompleteEvent) {
      this.test.status = status: e.status
    }

    // ...
}
```

### Setup 

aero expects you to tell it which stories to play, and which observable it should monitor.

```typescript
  const aero: Aero<TrialEvent> = new Aero(observable)
  const stories = [ProductStory, SpecStory, TestStory]
  aero.play(...stories)
  aero.observable.subscribe()
```

## 

- events
- handlers
- models
- sagas / context

