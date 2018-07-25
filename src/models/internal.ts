import { IReduxAction } from "./redux";

export type Listener = (action: IReduxAction) => void;

export interface IEventBusSource {
    dispatch(action: IReduxAction): void;
}

export interface IEventBusReceiver {
    takeOne(actionType: string, listener: Listener): () => void;
    takeEvery(actionType: string, listener: Listener): () => void;
    cancel(actionType: string, listener: Listener): void;
}

export interface IEventBus extends IEventBusSource, IEventBusReceiver { }
