# aero

## synopsis

wrap around observables and provide some higher-order management/routing functions...

## stories

the core model is a `Story` object that describes the ongoing 'journey' of a domain model
as events are processed

we 'route' events matching the attributes that the story model specifies as its correlation identifiers

this routing ends up making the story look something like a domain controller

```
export class TestStory extends SpecStory {
    name = 'test'
    correlatedOn = ['productId', 'specId', 'testId']
    startsWith = 'test:run-started'
    endsWith = 'test:run-completed'

    runStarted () {}

    runCompleted (e: RunCompleteEvent) {
      this.test = { ...this.test, status: e.status }
      this.log('completed: ' + e.status + ' -- ' + JSON.stringify(this.test))
    }

    // ...
}
```

essentially, aero just needs you to tell it which stories to play, and which observable it should monitor.

```
  const aero: Aero<TrialEvent> = new Aero(new Observable((subscriber) => {
    subscriber.next({ kind: 'product:run-started', productId: 'the-product' })
    subscriber.next({ kind: 'spec:run-started', productId: 'the-product', specId: 'the-spec' })
    subscriber.next({ kind: 'test:run-started', productId: 'the-product', specId: 'the-spec', testId: 'the-test' })
    subscriber.next({ kind: 'test:run-completed', productId: 'the-product', specId: 'the-spec', testId: 'the-test', status: 'pass' })
    subscriber.next({ kind: 'spec:run-completed', productId: 'the-product', specId: 'the-spec', status: 'pass' })
    subscriber.next({ kind: 'product:run-completed', productId: 'the-product', status: 'pass' })
  }))

  const stories = [ProductStory, SpecStory, TestStory]
  aero.play(...stories)
  aero.observable.subscribe()
```

## 

- events
- handlers
- models
- sagas / context

