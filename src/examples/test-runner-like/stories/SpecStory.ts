import { Spec, RunCompleteEvent } from '../types'
import { lookupSpec } from '../store'
import { Story } from '../../../aero'

export class SpecStory extends Story {
  name = 'spec'
  correlatedOn = ['productId', 'specId']
  startsWith = 'spec:run-started'
  endsWith = 'spec:run-completed'

  runStarted () {}

  runCompleted (e: RunCompleteEvent) { this.spec.status = e.status }

  get specId () { return this.context.specId }
  get productId () { return this.context.productId }
  get spec (): Spec { return lookupSpec(this.specId, this.productId) }
}
