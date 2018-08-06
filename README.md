# redux-event-bus
Middleware for redux that allows you to subscribe to actions that are dispatched to a redux store.

## Installation
Install the package

    npm install --save redux-event-bus

Then, to enable redux-event-bus:

```javascript
const {
    EventBus,
    createEventBusMiddleware
} = require("redux-event-bus");
const {
    applyMiddleware,
    createStore
} = require("redux");
const rootReducer = require("./reducers/index");

const evBus = new EventBus();

const evBusMiddleware = createEventBusMiddleware(evBus);

const store = createStore(
    rootReducer,
    applyMiddleware(evBusMiddleware)
);
```

If you are using other middlewares

```javascript
const {
    EventBus,
    createEventBusMiddleware
} = require("redux-event-bus");
const {
    applyMiddleware,
    compose,
    createStore
} = require("redux");
const rootReducer = require("./reducers/index");

const evBus = new EventBus();

const middlewares = [
    //Other middlewares
    createEventBusMiddleware(evBus),
];

const store = createStore(
    rootReducer,
    compose(applyMiddleware(...middlewares))
);
```

If you are using ES6 Imports, replace the line below using require with the import statement below in either example above.

```javascript
//replace
const {
    EventBus,
    createEventBusMiddleware
} = require("redux-event-bus");
//with
import {
    EventBus,
    createEventBusMiddleware
} from "redux-event-bus";
```

## Usage

### Listen for events for a particular action

```javascript
const store = createStore(reducers, middleware);// From above
//Imports
const evBus = new EventBus();
// Hook into redux e.x.: applyMiddleware
evBus.takeEvery("USER_LOGGED_IN", (action) => {
    if(action.user.isAdmin) {
        console.log("User is admin");
    }
});

store.dispatch({
    type: "USER_LOGGED_IN"
    user: {
        isAdmin: true
    }
}); //Will call function above

store.dispatch({
    type: "USER_LOGGED_IN"
    user: {
        isAdmin: false
    }
}); //Will call function above

```

### Listen for events for a particular action only once

```javascript
const store = createStore(reducers, middleware);// From above
//Imports
const evBus = new EventBus();
// Hook into redux e.x.: applyMiddleware
evBus.takeOne("USER_LOGGED_IN", (action) => {
    if(action.user.isAdmin) {
        console.log("User is admin");
    }
});

store.dispatch({
    type: "USER_LOGGED_IN"
    user: {
        isAdmin: true
    }
}); //Will call function above

store.dispatch({
    type: "USER_LOGGED_IN"
    user: {
        isAdmin: false
    }
}); //Will not call function above since it already has been called.

```

### Cancel events

```javascript
const store = createStore(reducers, middleware);// From above
//Imports
const evBus = new EventBus();
// Hook into redux e.x.: applyMiddleware
const cancelListener = evBus.takeEvery("USER_LOGGED_IN", (action) => {});
cancelListener();
store.dispatch({
    type: "USER_LOGGED_IN"
    user: {
        isAdmin: true
    }
}); //Will not call listener above since it was cancelled.

const handler = (action) => {};
evBus.takeOne("USER_LOGGED_IN", handler);
evBus.cancel("USER_LOGGED_IN", handler);

store.dispatch({
    type: "USER_LOGGED_IN"
    user: {
        isAdmin: true
    }
}); //Will not call listener above since it was cancelled.
```

## License

Copyright 2018 Jonah Nestrick

MIT License