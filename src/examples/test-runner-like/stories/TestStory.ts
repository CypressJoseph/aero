import { RunCompleteEvent, Test } from '../types'
import { lookupTest } from '../store'
import { Story } from '../../../aero'

export class TestStory extends Story {
    name = 'test'
    correlatedOn = ['productId', 'specId', 'testId']
    startsWith = 'test:run-started'
    endsWith = 'test:run-completed'

    runStarted () {}

    runCompleted (e: RunCompleteEvent) {
      this.test.status = e.status
    }

    get testId () { return this.context.testId }
    get specId () { return this.context.specId }
    get productId () { return this.context.productId }
    get test (): Test { return lookupTest(this.testId, this.specId, this.productId) }
}
