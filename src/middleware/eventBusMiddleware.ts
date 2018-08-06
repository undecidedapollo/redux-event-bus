import { IEventBusSource } from "../models/internal";

function createEventBusMiddleware(eventBus: IEventBusSource) {
    return (store: any) => (next) => (action) => {
        if (action && typeof (action.type) === "string") {
            eventBus.dispatch(action);
        }

        return next(action);
    };
}

export default createEventBusMiddleware;
