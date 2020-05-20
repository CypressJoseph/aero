import { Story } from '../aero'
import { ProductOpened, Product, ProductRunStarted } from './types'
import { productStore } from './store'

export class ProductStory extends Story<Event> {
  name: string = 'Product Lifecycle'
  respondsTo: string[] = ['product:run-started', 'product:run-completed']
  get correlatedOn () { return ['productId'] }
  get startsWith () { return 'product:opened' }

  open (opened: ProductOpened) {
    this.log(`product opened: ${opened}`)
    // productStore[this.productId] = { ...(opened.product) }
    this.product = { ...opened.product }
  }

  runStarted (started: ProductRunStarted) {
    this.log('run started')
    this.product = { ...this.product, status: 'running' }
  }

  runCompleted () {
    this.log('run completed')
    this.product = { ...this.product, status: 'pass' }
  }

  private log (message: string) { console.log(`[product story (productId=${this.productId})]`, message) }
  private get productId () { return this.context.productId }
  private get product () { return productStore[this.productId] }
  private set product (prod: Product) { productStore[this.productId] = prod }
}
