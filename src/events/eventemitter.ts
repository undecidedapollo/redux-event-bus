// src: https://gist.github.com/mudge/5830382

export type Listener = (...args: any[]) => void;

// I hate typescript
const GLOBAL_HANDLERS: string = Symbol("GLOBAL_HANDLERS") as any;

interface IEvents { [event: string]: Listener[]; }

export const GLOBAL_HANDLERS_SYMBOL = (GLOBAL_HANDLERS as unknown) as symbol;

export class EventEmitter {
    private readonly events: IEvents = {};

    public all(listener: Listener): () => void {
        return this.on(GLOBAL_HANDLERS, listener);
    }

    public on(event: string, listener: Listener): () => void {
        if (typeof this.events[event] !== "object") {
            this.events[event] = [];
        }

        this.events[event].push(listener);
        return () => this.removeListener(event, listener);
    }

    public removeListener(event: string, listener: Listener): void {
        if (typeof this.events[event] !== "object") {
            return;
        }

        const idx: number = this.events[event].indexOf(listener);
        if (idx > -1) {
            this.events[event].splice(idx, 1);
        }
    }

    public removeAllListeners(): void {
        Object.keys(this.events).forEach((event: string) =>
            this.events[event].splice(0, this.events[event].length),
        );
    }

    public emit(event: string, ...args: any[]): void {
        const handlers = [
            ...this.getHandlers(GLOBAL_HANDLERS),
            ...this.getHandlers(event),
        ];

        handlers.forEach((listener) => listener.apply(this, args));
    }

    public once(event: string, listener: Listener): () => void {
        const remove: (() => void) = this.on(event, (...args: any[]) => {
            remove();
            listener.apply(this, args);
        });

        return remove;
    }

    private getHandlers(event: string, devVal: any = []) {
        return this.events[event] || devVal;
    }
}
