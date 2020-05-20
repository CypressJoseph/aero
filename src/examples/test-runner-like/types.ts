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
  assertions: Assertion[]
}

export interface Assertion {
  id: AssertionID
  expected: string
  actual: string
  status: Status
}

type PRODUCT_OPENED = 'product:opened'
type PRODUCT_RUN_STARTED = 'product:run-started'
type PRODUCT_RUN_COMPLETED = 'product:run-completed'
type SPEC_RUN_STARTED = 'spec:run-started'
type SPEC_RUN_COMPLETED = 'spec:run-completed'
type TEST_RUN_STARTED = 'test:run-started'
type TEST_RUN_COMPLETED = 'test:run-completed'
type ASSERT_RUN_STARTED = 'assert:run-started'
type ASSERT_RUN_COMPLETED = 'assert:run-completed'

export interface ProductOpened {
  kind: PRODUCT_OPENED
  productId: ProductID
}

export type RunCompleteEvent = { status: Status }

export interface ProductRunStarted {
  kind: PRODUCT_RUN_STARTED
  productId: ProductID
}

export type ProductRunCompleted = {
  kind: PRODUCT_RUN_COMPLETED
  productId: ProductID
} & RunCompleteEvent

export interface SpecRunStarted {
  kind: SPEC_RUN_STARTED
  productId: ProductID
  specId: SpecID
}

export type SpecRunCompleted = {
  kind: SPEC_RUN_COMPLETED
  productId: ProductID
  specId: SpecID
} & RunCompleteEvent

export interface TestRunStarted {
  kind: TEST_RUN_STARTED
  productId: ProductID
  specId: SpecID
  testId: TestID
}

export type TestRunCompleted = {
  kind: TEST_RUN_COMPLETED
  productId: ProductID
  specId: SpecID
  testId: TestID
} & RunCompleteEvent

export type TrialEvent = ProductOpened
                       | ProductRunStarted
                       | ProductRunCompleted
                       | SpecRunStarted
                       | SpecRunCompleted
                       | TestRunStarted
                       | TestRunCompleted
