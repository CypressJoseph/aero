export type Status = 'not-run' | 'pass' | 'fail' | 'running'

export type ProductID = string & { unit: 'product-id' }
export type SpecID = string & { unit: 'spec-id' }
export type TestID = string & { unit: 'test-id' }
export type AssertionID = string & { unit: 'assertion-id' }

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
  assertions: Assertion[]
}

export interface Assertion {
  id: AssertionID
  expected: string
  actual?: string
  status: Status
}

const PRODUCT_UPDATED = 'product:updated'
const PRODUCT_RUN_STARTED = 'product:run-started'
const PRODUCT_RUN_COMPLETED = 'product:run-completed'
const SPEC_RUN_STARTED = 'spec:run-started'
const SPEC_RUN_COMPLETED = 'spec:run-completed'
const TEST_RUN_STARTED = 'test:run-started'
const TEST_RUN_COMPLETED = 'test:run-completed'
const ASSERT_RUN_STARTED = 'assert:run-started'
const ASSERT_RUN_COMPLETED = 'assert:run-completed'

export type RunCompleteEvent = { status: Status }

export interface ProductUpdated {
  kind: typeof PRODUCT_UPDATED
  productId: ProductID
  product: Product
}

export interface ProductRunStarted {
  kind: typeof PRODUCT_RUN_STARTED
  productId: ProductID
}

export type ProductRunCompleted = {
  kind: typeof PRODUCT_RUN_COMPLETED
  productId: ProductID
} & RunCompleteEvent

export interface SpecRunStarted {
  kind: typeof SPEC_RUN_STARTED
  productId: ProductID
  specId: SpecID
}

export type SpecRunCompleted = {
  kind: typeof SPEC_RUN_COMPLETED
  productId: ProductID
  specId: SpecID
} & RunCompleteEvent

export interface TestRunStarted {
  kind: typeof TEST_RUN_STARTED
  productId: ProductID
  specId: SpecID
  testId: TestID
}

export type TestRunCompleted = {
  kind: typeof TEST_RUN_COMPLETED
  productId: ProductID
  specId: SpecID
  testId: TestID
} & RunCompleteEvent

export interface AssertionRunStarted {
  kind: typeof ASSERT_RUN_STARTED
  productId: ProductID
  specId: SpecID
  testId: TestID
  assertionId: AssertionID
}

export type AssertionRunCompleted = {
  kind: typeof ASSERT_RUN_COMPLETED
  productId: ProductID
  specId: SpecID
  testId: TestID
  assertionId: AssertionID
  actual: string
} & RunCompleteEvent

export type TrialEvent
  = ProductUpdated
  | ProductRunStarted
  | ProductRunCompleted
  | SpecRunStarted
  | SpecRunCompleted
  | TestRunStarted
  | TestRunCompleted
  | AssertionRunStarted
  | AssertionRunCompleted
