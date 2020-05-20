import { Story } from '../aero'
import { SpecRunCompleted } from './types'

export class SpecStory extends Story {
  name = 'Spec Lifecycle'
  respondsTo = ['spec:run-started', 'spec:run-completed']
  correlatedOn = ['productId', 'specId']
  startsWith = 'spec:run-started'
  endsWith = 'spec:run-completed'

  // dependsOn = [ProductStory] // hmm

  runStarted () { this.log('start spec') }
  runCompleted (e: SpecRunCompleted) { this.log('complete spec: ' + e.status) }
}
