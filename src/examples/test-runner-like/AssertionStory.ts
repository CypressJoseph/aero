import { TestStory } from './TestStory'
import { Assertion, RunCompleteEvent } from './types'
import { lookupAssertion } from './store'

export class AssertionStory extends TestStory {
    name = 'assert'
    correlatedOn = ['productId', 'specId', 'testId', 'assertionId']
    startsWith = 'assert:run-started'
    endsWith = 'assert:run-completed'

    runStarted () {}
    runCompleted (e: RunCompleteEvent) {
      this.assertion.status = e.status
    }

    protected get assertId () { return this.context.assertionId }
    protected get assertion (): Assertion { return lookupAssertion(this.assertId, this.testId, this.specId, this.productId) }
}
