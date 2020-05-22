import { ProductID, SpecID, TestID, AssertionID, TrialEvent, Status, Product } from './types'
export const productId: ProductID = 'the-product' as ProductID
const specId: SpecID = 'the-spec' as SpecID
const testId: TestID = 'the-test' as TestID
const assertionId: AssertionID = 'the-assertion' as AssertionID
const secondAssertionId: AssertionID = 'another-assertion' as AssertionID

export const product: Product = {
  id: productId,
  name: 'aerolith',
  status: 'not-run',
  specs: [
    {
      id: specId,
      relativePath: '/path/to/spec.ts',
      status: 'not-run',
      tests: [{
        id: testId,
        description: 'a test case',
        status: 'not-run',
        assertions: [{
          id: assertionId,
          expected: 'hello world',
          status: 'not-run'
        }, {
          id: secondAssertionId,
          expected: 'hello world',
          status: 'not-run'
        }]
      }]
    }
  ]
}

const pass: { status: Status } = { status: 'pass' }
const fail: { status: Status } = { status: 'fail' }

export const simpleRun: TrialEvent[] = [
  { kind: 'product:updated', productId, product },
  { kind: 'product:run-started', productId },
  { kind: 'spec:run-started', productId, specId },
  { kind: 'test:run-started', productId, specId, testId },
  { kind: 'assert:run-started', productId, specId, testId, assertionId },
  { kind: 'assert:run-completed', productId, specId, testId, assertionId, ...pass, actual: 'hello world' },
  { kind: 'assert:run-started', productId, specId, testId, assertionId: secondAssertionId },
  { kind: 'assert:run-completed', productId, specId, testId, assertionId: secondAssertionId, ...fail, actual: 'hello there' },
  { kind: 'test:run-completed', productId, specId, testId, ...pass },
  { kind: 'spec:run-completed', productId, specId, ...pass },
  { kind: 'product:run-completed', productId, ...pass }
]
