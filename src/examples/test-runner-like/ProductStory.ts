import { Story } from '../../aero'
import { Product, RunCompleteEvent } from './types'
import { updateProduct, lookupProduct } from './store'

export class ProductStory extends Story {
  name = 'product'
  correlatedOn = ['productId']
  startsWith = 'product:run-started'
  endsWith = 'product:run-completed'

  runStarted () {}

  runCompleted (runComplete: RunCompleteEvent) {
    this.product = { ...this.product, status: runComplete.status }
  }

  protected get productId () { return this.context.productId }
  protected get product () { return lookupProduct(this.productId) }
  protected set product (product: Product) { updateProduct(this.productId, product) }
}
