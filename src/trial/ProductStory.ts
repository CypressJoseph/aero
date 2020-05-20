import { Story } from '../aero'
import { ProductOpened, Product, ProductRunStarted } from './types'
import { productStore } from './store'

export class ProductStory extends Story {
  name = 'Product Lifecycle'
  respondsTo = ['product:run-started', 'product:run-completed']
  correlatedOn = ['productId']
  startsWith = 'product:opened'
  endsWith = 'product:closed'

  opened () {
    this.log('product open!')
  }

  runStarted () {
    this.log('run started')
    this.product = { ...this.product, status: 'running' }
  }

  runCompleted () {
    this.log('run completed')
    this.product = { ...this.product, status: 'pass' }
  }

  private get productId () { return this.context.productId }
  private get product () { return productStore.get(this.productId) }
  private set product (prod: Product) { productStore.set(this.productId, prod) }
}
