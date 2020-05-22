# aerolith

## Synopsis

Microframework for correlating events from observables

## Stories

The core model is a `Story` object that describes the ongoing 'journey' of a domain model
as events are processed

We route events to matching story methods, given the event correlates with the attributes that the story model specifies. 

If we detect an event that is one of the event types that the story declares it `startsWith`...
We'll use the event attributes this story declares it is `correlatedOn`...
And route further correlated events to methods on this story.

So the story ends up looking something like a domain controller:

```typescript
import { Story } from 'aerolith'
export class TestStory extends Story {
    name = 'test'
    correlatedOn = ['productId', 'specId', 'testId']
    startsWith = 'test:run-started'
    endsWith = 'test:run-completed'

    runStarted () {}

    runCompleted (e: RunCompleteEvent) {
      this.test.status = e.status
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

## Notes

* This solution means a lot of implicit structure is taken from the event name. The event name is expected to be of the form `category:something-happened`. We currently assume the "category" string appearing before the colon is an implicit namespace

  This "channel separation" exists primarily in order not to send redundant or inaccurate events, but a limitation is that we are currently limited to the single domain a story specifies (so a story couldn't monitor events across "domains" for now). 

  One thought is that stories might specify the 'channels' they are interested in, but note this creates some ambiguity with the "controller-style" routing mechanism. That is: if two events in different domains happen to have the same name (i.e., are identical 'after the colon'), they would end up incorrectly invoking the same story action...

* We're still listening to events even after we see the `endsWith`. More rxjs research indicated