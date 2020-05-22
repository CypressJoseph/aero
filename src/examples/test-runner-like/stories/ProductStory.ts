import { Story } from '../../../aero'
import { Product, RunCompleteEvent, ProductUpdated } from '../types'
import { updateProduct, lookupProduct } from '../store'

export class ProductStory extends Story {
  name = 'product'
  correlatedOn = ['productId']
  startsWith = 'product:run-started'
  endsWith = 'product:run-completed'

  updated (updated: ProductUpdated) {
    this.product = updated.product
  }

  runStarted () {}

  runCompleted (runComplete: RunCompleteEvent) {
    this.product = { ...this.product, status: runComplete.status }
  }

  get productId () { return this.context.productId }
  get product (): Product { return lookupProduct(this.productId) }
  set product (product: Product) { updateProduct(this.productId, product) }
}
