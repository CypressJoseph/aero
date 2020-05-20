export type Status = 'not-run' | 'pass' | 'fail' | 'running'

export type ProductID = string
export type SpecID = string
export type TestID = string
export type AssertionID = string

export interface Product {
  id: ProductID
  name: string
  specs: Spec[]
  status: Status
}

export interface Spec {
  id: SpecID
  relativePath: string
  status: Status
  tests: Test[]
}

export interface Test {
  id: TestID
  parentId?: TestID
  description: string
  status: Status
}

export interface Assertion {
  id: AssertionID
}

export type AggRoot = { activeProducts: Product[] }

type PRODUCT_OPENED = 'product:opened'
type PRODUCT_UPDATED = 'product:updated'
type PRODUCT_CLOSED = 'product:closed'

type PRODUCT_RUN_STARTED = 'product:run-started'
type PRODUCT_RUN_PASSED = 'product:run-passed'
type PRODUCT_RUN_FAILED = 'product:run-failed'
type PRODUCT_RUN_COMPLETED = 'product:run-completed'

type SPEC_RUN_STARTED = 'spec:run-started'
type SPEC_RUN_COMPLETED = 'spec:run-completed'

type TEST_RUN_STARTED = 'test:run-started'
type TEST_RUN_COMPLETED = 'test:run-completed'

type ASSERT_RUN_STARTED = 'assert:run-started'
type ASSERT_RUN_COMPLETED = 'assert:run-completed'

type EventKind = PRODUCT_OPENED
               | PRODUCT_UPDATED
               | PRODUCT_CLOSED

export interface ProductOpened {
  kind: PRODUCT_OPENED
  // product: Product
  productId: ProductID
}

// export interface ProductUpdated {
//   kind: PRODUCT_UPDATED
//   productId: ProductID
// }

// export interface ProductClosed {
//   kind: PRODUCT_CLOSED
//   productId: ProductID
// }

export interface ProductRunStarted {
  kind: PRODUCT_RUN_STARTED
  productId: ProductID
}

export interface ProductRunCompleted {
  kind: PRODUCT_RUN_COMPLETED
  productId: ProductID
  status: Status
}

export interface SpecRunStarted {
  kind: SPEC_RUN_STARTED
  productId: ProductID
  specId: SpecID
}

export interface SpecRunCompleted {
  kind: SPEC_RUN_COMPLETED
  productId: ProductID
  specId: SpecID
  status: Status
}

export type TrialEvent = ProductOpened
                       | ProductRunStarted
                       | ProductRunCompleted
                       | SpecRunStarted
                       | SpecRunCompleted
