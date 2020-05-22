import Pino from 'pino'
export const logger = Pino({ name: 'aero', prettyPrint: true, level: 'info' })
