import { Story } from '../aero'
import { ProductOpened, Product, ProductRunStarted } from './types'
import { productStore } from './store'

export class ProductStory extends Story<Event> {
  name: string = 'Product Lifecycle'
  respondsTo: string[] = [
    'product:opened',
    'product:run-started',
    'product:run-completed'
  ]

  get correlatedOn () { return ['productId'] }
  get startsWith () { return 'product:run-started' }
  get productId () { return this.context.productId }
  get product () { return productStore[this.productId] }

  open (opened: ProductOpened) {
    this.log('product opened')
    productStore[this.productId] = { ...(opened.product) }
  }

  runStarted (started: ProductRunStarted) {
    this.log('run started')
    // this.context.productId = started.productId
    productStore[this.productId] = { ...this.product, status: 'running' }
  }

  runCompleted () {
    this.log('run completed')
    productStore[this.productId] = { ...this.product, status: 'pass' }
  }

  private log (message: string) { console.log(`[product story (productId=${this.productId})]`, message) }
}
