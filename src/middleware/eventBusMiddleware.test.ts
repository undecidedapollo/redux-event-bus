/* tslint:disable:no-unused-expression */
import "mocha";
import createEventBusMiddleware from "./eventBusMiddleware";
import { expect, assert } from "chai";
import { spy } from "sinon";

describe("EventBusMiddleware", () => {
    it("must be a function that takes the eventBus", () => {
        assert.isFunction(createEventBusMiddleware);
        assert.strictEqual(createEventBusMiddleware.length, 1);
    });

    describe("handle store", () => {
        it("must return a function that takes the store", () => {
            const dispatch = spy();
            const res = createEventBusMiddleware({
                dispatch,
            });
            assert.isFunction(res);
            assert.strictEqual(res.length, 1);
            expect(dispatch.calledOnce).to.equal(false);
        });

        describe("handle next", () => {
            it("must return a function to handle the next middleware", () => {
                const dispatch = spy();
                const res = createEventBusMiddleware({
                    dispatch,
                })({});
                assert.isFunction(res);
                assert.strictEqual(res.length, 1);
                expect(dispatch.calledOnce).to.equal(false);
            });

            describe("handle action", () => {
                it("must return a function to handle the action", () => {
                    const dispatch = spy();
                    const res = createEventBusMiddleware({
                        dispatch,
                    })({})({});
                    assert.isFunction(res);
                    assert.strictEqual(res.length, 1);
                    expect(dispatch.calledOnce).to.equal(false);
                });

                it("should call dispatch with the given action", () => {
                    const store = {};
                    const nextMiddleware = spy();
                    const dispatch = spy();
                    const action = {};
                    const eventBusSource = {
                        dispatch,
                    };
                    const result = createEventBusMiddleware(eventBusSource);
                    result(store)(nextMiddleware)(action);
                    expect(dispatch.calledOnce).to.be.true;
                    expect(dispatch.alwaysCalledWithExactly(action)).to.be.true;
                    expect(nextMiddleware.calledOnce).to.be.true;
                    expect(nextMiddleware.alwaysCalledWithExactly(action)).to.be.true;
                });
            });
        });
    });
});
