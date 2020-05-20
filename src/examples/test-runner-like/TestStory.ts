import { SpecStory } from './SpecStory'
import { RunCompleteEvent, Test } from './types'
import { findOrCreateById, update } from '../../aero/util'

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

    private get testId () { return this.context.testId }
    private get test (): Test {
      this.spec.tests = this.spec.tests || []
      const nullTest: Test = {
        id: this.testId,
        description: '??',
        status: 'not-run',
        assertions: []
      }
      return findOrCreateById(this.spec.tests, this.testId, nullTest)
    }

    private set test (updated: Test) {
      update(this.test, updated)
    }
}
