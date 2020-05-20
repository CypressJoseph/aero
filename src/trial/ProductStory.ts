import { Story } from '../aero'
import { Product, RunCompleteEvent } from './types'
import { productStore } from './store'

export class ProductStory extends Story {
  name = 'product'
  respondsTo = ['product:run-started', 'product:run-completed']
  correlatedOn = ['productId']
  startsWith = 'product:opened'
  endsWith = 'product:closed'

  opened () {}

  runStarted () {
    this.product = { ...this.product, status: 'running' }
  }

  runCompleted (runComplete: RunCompleteEvent) {
    this.product = { ...this.product, status: runComplete.status }
  }

  protected get productId () { return this.context.productId }
  protected get product () { return productStore.get(this.productId) }
  protected set product (prod: Product) { productStore.set(this.productId, prod) }
}
