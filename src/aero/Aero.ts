type EventHandler<T> = (event: T) => void
export class Aero<Event extends { kind: string }> {
    on<T extends Event>(kind: string, handler: EventHandler<T>) {
        this.registerHandler(kind, handler)
    }

    async dispatch<T extends Event>(event: T) {
        this.store(event)
        let handler: EventHandler<T> = this.handlers[event.kind] //kind]
        handler.call(this, event)
    }

    handlers: { [kind: string]: EventHandler<any> } = {}
    private registerHandler<T extends Event>(kind: string, handler: EventHandler<T>) {
        this.handlers[kind] = handler
    }

    events: Event[] = []
    private store(event: Event) {
        this.events.push(event)
    }

    event(name: string) { throw new Error("[aero] Aero.event not implemented") }
    model(name: string) { throw new Error("[aero] Aero.model not implemented") }
}