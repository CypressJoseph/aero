import { Spec, RunCompleteEvent } from './types'
import { ProductStory } from './ProductStory'
import { findOrCreateById, update } from '../../aero/util'
import { lookupSpec } from './store'

export class SpecStory extends ProductStory {
  name = 'spec'
  correlatedOn = ['productId', 'specId']
  startsWith = 'spec:run-started'
  endsWith = 'spec:run-completed'

  runStarted () {}

  runCompleted (e: RunCompleteEvent) { this.spec.status = e.status }

  protected get specId () { return this.context.specId }
  protected get spec (): Spec { return lookupSpec(this.specId, this.productId) }
}
