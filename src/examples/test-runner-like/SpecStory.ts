import { Spec, RunCompleteEvent } from './types'
import { ProductStory } from './ProductStory'
import { findOrCreateById, update } from '../../aero/util'

export class SpecStory extends ProductStory {
  name = 'spec'
  correlatedOn = ['productId', 'specId']
  startsWith = 'spec:run-started'
  endsWith = 'spec:run-completed'

  runStarted () {
    // this.log('spec:run-started? ')
    this.spec.status = 'running'
  }

  runCompleted (e: RunCompleteEvent) {
    this.spec = { ...this.spec, status: e.status }
  }

  protected get specId () { return this.context.specId }
  protected get spec (): Spec {
    this.product.specs = this.product.specs || []
    const nullSpec: Spec = { id: this.specId, relativePath: '??', status: 'not-run', tests: [] }
    return findOrCreateById(this.product.specs, this.specId, nullSpec)
  }

  protected set spec (updated: Spec) {
    update(this.spec, updated)
  }
}
