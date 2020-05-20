import { SpecStory } from './SpecStory'
import { RunCompleteEvent, Test } from './types'
import { findOrCreateById, update } from '../../aero/util'
import { lookupTest } from './store'

export class TestStory extends SpecStory {
    name = 'test'
    correlatedOn = ['productId', 'specId', 'testId']
    startsWith = 'test:run-started'
    endsWith = 'test:run-completed'

    runStarted () {}

    runCompleted (e: RunCompleteEvent) {
      this.test.status = e.status
    }

    protected get testId () { return this.context.testId }
    protected get test (): Test { return lookupTest(this.testId, this.specId, this.productId) }
}
