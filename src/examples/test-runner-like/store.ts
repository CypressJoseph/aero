import { Product, ProductID } from './types'
import { InMemoryObjectStore } from '../ObjectStore'
export const productStore: InMemoryObjectStore<Product, ProductID> =
    new InMemoryObjectStore()
