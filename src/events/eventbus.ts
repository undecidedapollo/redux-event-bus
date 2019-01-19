import { IEventBus, IEventBusReceiver, IEventBusSource, Listener } from "../models/internal";
import { IReduxAction } from "../models/redux";
import { EventEmitter } from "./eventemitter";

export default class StandardEventBus implements IEventBus {
    private readonly emitter: EventEmitter;

    get source(): IEventBusSource {
        return {
            dispatch: this.dispatch,
        };
    }

    get receiver(): IEventBusReceiver {
        return {
            cancel: this.cancel,
            takeAll: this.takeAll,
            takeEvery: this.takeEvery,
            takeOne: this.takeOne,
        };
    }

    constructor() {
        this.emitter = new EventEmitter();
    }

    public dispatch = (action: IReduxAction): void => {
        this.emitter.emit(action.type, action);
    }

    public cancel = (actionType: string, listener: Listener) => {
        this.emitter.removeListener(actionType, listener);
    }

    public cancelAll = () => {
        this.emitter.removeAllListeners();
    }

    public takeAll = (listener: Listener) => {
        return this.emitter.all(listener);
    }

    public takeOne = (actionType: string, listener: Listener) => {
        return this.emitter.once(actionType, listener);
    }

    public takeEvery = (actionType: string, listener: Listener) => {
        return this.emitter.on(actionType, listener);
    }
}
