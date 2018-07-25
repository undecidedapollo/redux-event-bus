import eventBus from "./events/eventbus";
import eventBusMiddleware from "./middleware/eventBusMiddleware";

export const createEventBusMiddleware = eventBusMiddleware;
export const EventBus = eventBus;
