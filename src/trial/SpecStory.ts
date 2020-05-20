import { Spec, RunCompleteEvent } from './types'
import { ProductStory } from './ProductStory'

export class SpecStory extends ProductStory {
  name = 'spec'
  respondsTo = ['spec:run-started', 'spec:run-completed']
  correlatedOn = ['productId', 'specId']
  startsWith = 'spec:run-started'
  endsWith = 'spec:run-completed'

  runStarted () { this.log('start spec run!') }
  runCompleted (e: RunCompleteEvent) {
    this.log('finish spec run with status: ' + e.status)
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
    const theSpec: Spec = this.spec
    Object.entries(updated).forEach(([attr, val]) => { (theSpec as any)[attr] = val })
  }
}
