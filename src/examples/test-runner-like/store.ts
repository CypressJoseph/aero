import { Product, ProductID, Spec, SpecID, TestID, Test, AssertionID, Assertion } from './types'
import { InMemoryObjectStore } from '../ObjectStore'
import { findOrCreateById } from '../../aero/util'

export const productStore: InMemoryObjectStore<Product, ProductID> =
    new InMemoryObjectStore()

export function lookupProduct (id: ProductID): Product {
  return productStore.get(id)
}

export function updateProduct (id: ProductID, product: Product) {
  productStore.set(id, product)
}

export function lookupSpec (id: SpecID, productId: ProductID): Spec {
  const product: Product = lookupProduct(productId)
  product.specs = product.specs || []
  const nullSpec: Spec = { id, relativePath: '??', status: 'not-run', tests: [] }
  return findOrCreateById(product.specs, id, nullSpec)
}

export function lookupTest (id: TestID, specId: SpecID, productId: ProductID): Test {
  const spec: Spec = lookupSpec(specId, productId)
  spec.tests = spec.tests || []
  const nullTest: Test = {
    id,
    description: '??',
    status: 'not-run',
    assertions: []
  }
  return findOrCreateById(spec.tests, id, nullTest)
}

export function lookupAssertion (id: AssertionID, testId: TestID, specId: SpecID, productId: ProductID): Assertion {
  const test: Test = lookupTest(testId, specId, productId)
  test.assertions = test.assertions || []
  const nullAssert: Assertion = {
    id,
    expected: '??',
    actual: '!!',
    status: 'not-run'
  }
  return findOrCreateById(test.assertions, id, nullAssert)
}
