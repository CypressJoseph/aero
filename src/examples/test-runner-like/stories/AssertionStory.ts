import { Assertion, RunCompleteEvent, AssertionRunCompleted } from '../types'
import { lookupAssertion } from '../store'
import { Story } from '../../../aero'

export class AssertionStory extends Story {
    name = 'assert'
    correlatedOn = ['productId', 'specId', 'testId', 'assertionId']
    startsWith = 'assert:run-started'
    endsWith = 'assert:run-completed'

    runStarted () {}
    runCompleted (e: AssertionRunCompleted) {
      this.assertion.status = e.status
      this.assertion.actual = e.actual
    }

    get productId () { return this.context.productId }
    get testId () { return this.context.testId }
    get specId () { return this.context.specId }
    get assertId () { return this.context.assertionId }
    get assertion (): Assertion {
      return lookupAssertion(this.assertId, this.testId, this.specId, this.productId)
    }
}
