import { Spec, RunCompleteEvent } from './types'
import { ProductStory } from './ProductStory'

export class SpecStory extends ProductStory {
  name = 'spec'
  correlatedOn = ['productId', 'specId']
  startsWith = 'spec:run-started'
  endsWith = 'spec:run-completed'

  runStarted () {
    this.spec = { ...this.spec, status: 'running' }
  }

  runCompleted (e: RunCompleteEvent) {
    this.spec = { ...this.spec, status: e.status }
  }

  private get specId () { return this.context.specId }
  private get spec (): Spec {
    this.product.specs = this.product.specs || []
    const existing: Spec | undefined = this.product.specs.find(spec => spec.id === this.specId)
    if (existing) { return existing }
    const spec: Spec = { id: this.specId, relativePath: '??', status: 'not-run', tests: [] }
    this.product.specs.push(spec)
    return spec
  }

  private set spec (updated: Spec) {
    Object.entries(updated).forEach(([attr, val]) => { (this.spec as any)[attr] = val })
  }
}
