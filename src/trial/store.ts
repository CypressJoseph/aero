import { Product, ProductID } from './types'

class Store<T, ID extends string> {
    _store: { [key: string]: T } = {}
    set (key: ID, value: T) { this._store[key] = value }
    get (key: ID) { return this._store[key] }
    get size () { return Object.entries(this._store).length }
}

export const productStore: Store<Product, ProductID> = new Store()
