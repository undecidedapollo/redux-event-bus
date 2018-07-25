import { IEventBusSource } from "../models/internal";

function createEventBusMiddleware(eventBus: IEventBusSource) {
    return (store: any) => (next) => (action) => {
        eventBus.dispatch(action);
        return next(action);
    };
}

export default createEventBusMiddleware;
