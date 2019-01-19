/* tslint:disable:no-unused-expression */
import "mocha";
import EventBus from "./eventbus";
import { expect } from "chai";
import { fake } from "sinon";

const EV_1 = {
    type: "EV_1",
};
const EV_2 = {
    type: "EV_2",
};
const EV_3 = {
    type: "EV_3",
};

describe("EventBus", () => {
    let ev: EventBus = null;

    beforeEach(() => {
        ev = new EventBus();
    });

    describe("props", () => {
        it("source - should return object with only dispatch function", () => {
            expect(ev.source).to.exist;
            expect(typeof (ev.source.dispatch) === "function").to.be.true;
            expect(ev.source.dispatch.length).to.equal(1);
        });

        it("receiver - should return object with only dispatch function", () => {
            expect(ev.receiver).to.exist;
            expect(typeof (ev.receiver.cancel) === "function").to.be.true;
            expect(typeof (ev.receiver.takeEvery) === "function").to.be.true;
            expect(typeof (ev.receiver.takeOne) === "function").to.be.true;
            expect(ev.receiver.cancel.length).to.equal(2);
            expect(ev.receiver.takeEvery.length).to.equal(2);
            expect(ev.receiver.takeOne.length).to.equal(2);
        });
    });

    describe("takeAll", () => {
        it("should call listener when event is emitted.", () => {
            const l1 = fake();
            ev.takeAll(l1);
            ev.dispatch(EV_1);
            expect(l1.callCount).to.equal(1);
            expect(l1.alwaysCalledWithExactly(EV_1)).to.be.true;
        });

        it("should call multiple listeners that are subscribed.", () => {
            const l1 = fake();
            const l2 = fake();
            ev.takeAll(l1);
            ev.takeAll(l2);
            ev.dispatch(EV_1);
            expect(l1.callCount).to.equal(1);
            expect(l1.alwaysCalledWithExactly(EV_1)).to.be.true;
            expect(l2.callCount).to.equal(1);
            expect(l2.alwaysCalledWithExactly(EV_1)).to.be.true;
        });

        it("should call listener multiple times when event is emitted multiple times.", () => {
            const l1 = fake();
            ev.takeAll(l1);
            ev.dispatch(EV_1);
            ev.dispatch(EV_1);
            ev.dispatch(EV_1);
            expect(l1.callCount).to.equal(3);
            expect(l1.alwaysCalledWithExactly(EV_1)).to.be.true;
        });

        it("should not call listener if same listener removed", () => {
            const l1 = fake();
            const removal = ev.takeAll(l1);
            removal();
            ev.dispatch(EV_1);
            expect(l1.called).to.be.false;
        });
    });

    describe("takeEvery", () => {
        it("should call listener when event is emitted.", () => {
            const l1 = fake();
            ev.takeEvery(EV_1.type, l1);
            ev.dispatch(EV_1);
            expect(l1.callCount).to.equal(1);
            expect(l1.alwaysCalledWithExactly(EV_1)).to.be.true;
        });

        it("should only call listener that is subscribed to that event.", () => {
            const l1 = fake();
            const l2 = fake();
            ev.takeEvery(EV_1.type, l1);
            ev.takeEvery(EV_2.type, l2);
            ev.dispatch(EV_1);
            expect(l1.callCount).to.equal(1);
            expect(l1.alwaysCalledWithExactly(EV_1)).to.be.true;
            expect(l2.called).to.be.false;
        });

        it("should call multiple listeners that are subscribed.", () => {
            const l1 = fake();
            const l2 = fake();
            ev.takeEvery(EV_1.type, l1);
            ev.takeEvery(EV_1.type, l2);
            ev.dispatch(EV_1);
            expect(l1.callCount).to.equal(1);
            expect(l1.alwaysCalledWithExactly(EV_1)).to.be.true;
            expect(l2.callCount).to.equal(1);
            expect(l2.alwaysCalledWithExactly(EV_1)).to.be.true;
        });

        it("should call listener multiple times when event is emitted multiple times.", () => {
            const l1 = fake();
            ev.takeEvery(EV_1.type, l1);
            ev.dispatch(EV_1);
            ev.dispatch(EV_1);
            ev.dispatch(EV_1);
            expect(l1.callCount).to.equal(3);
            expect(l1.alwaysCalledWithExactly(EV_1)).to.be.true;
        });

        it("should not call listener if same listener removed", () => {
            const l1 = fake();
            const removal = ev.takeEvery(EV_1.type, l1);
            removal();
            ev.dispatch(EV_1);
            expect(l1.called).to.be.false;
        });
    });

    describe("takeOne", () => {
        it("should call listener when event is emitted.", () => {
            const l1 = fake();
            ev.takeOne(EV_1.type, l1);
            ev.dispatch(EV_1);
            expect(l1.callCount).to.equal(1);
            expect(l1.alwaysCalledWithExactly(EV_1)).to.be.true;
        });

        it("should only call listener that is subscribed to that event.", () => {
            const l1 = fake();
            const l2 = fake();
            ev.takeOne(EV_1.type, l1);
            ev.takeOne(EV_2.type, l2);
            ev.dispatch(EV_1);
            expect(l1.callCount).to.equal(1);
            expect(l1.alwaysCalledWithExactly(EV_1)).to.be.true;
            expect(l2.called).to.be.false;
        });

        it("should call multiple listeners that are subscribed.", () => {
            const l1 = fake();
            const l2 = fake();
            ev.takeOne(EV_1.type, l1);
            ev.takeOne(EV_1.type, l2);
            ev.dispatch(EV_1);
            expect(l1.callCount).to.equal(1);
            expect(l1.alwaysCalledWithExactly(EV_1)).to.be.true;
            expect(l2.callCount).to.equal(1);
            expect(l2.alwaysCalledWithExactly(EV_1)).to.be.true;
        });

        it("should call listener once when event is emitted multiple times.", () => {
            const l1 = fake();
            ev.takeOne(EV_1.type, l1);
            ev.dispatch(EV_1);
            ev.dispatch(EV_1);
            ev.dispatch(EV_1);
            expect(l1.callCount).to.equal(1);
            expect(l1.alwaysCalledWithExactly(EV_1)).to.be.true;
        });

        it("should not call listener if same listener removed", () => {
            const l1 = fake();
            const removal = ev.takeOne(EV_1.type, l1);
            removal();
            ev.dispatch(EV_1);
            expect(l1.called).to.be.false;
        });
    });

    describe("cancel", () => {
        it("should not call listener that is removed.", () => {
            const l1 = fake();
            ev.takeEvery(EV_1.type, l1);
            ev.cancel(EV_1.type, l1);
            ev.dispatch(EV_1);
            expect(l1.callCount).to.equal(0);
        });

        it("should call other listeners if single listener is removed.", () => {
            const l1 = fake();
            const l2 = fake();
            ev.takeEvery(EV_1.type, l1);
            ev.takeEvery(EV_1.type, l2);
            ev.cancel(EV_1.type, l1);
            ev.dispatch(EV_1);
            expect(l1.callCount).to.equal(0);
            expect(l2.callCount).to.equal(1);
            expect(l2.alwaysCalledWithExactly(EV_1)).to.be.true;
        });

        it("should not fail if listener is not found", () => {
            const l1 = fake();
            const l2 = fake();
            ev.takeEvery(EV_1.type, l2);
            ev.cancel(EV_1.type, l1);
            expect(l1.callCount).to.equal(0);
            expect(l2.callCount).to.equal(0);
        });

        it("should not fail if event is not found", () => {
            const l1 = fake();
            ev.cancel(EV_1.type, l1);
            expect(l1.callCount).to.equal(0);
        });
    });

    describe("cancelAll", () => {
        it("should not call any listener on single event.", () => {
            const l1 = fake();
            ev.takeEvery(EV_1.type, l1);
            ev.cancelAll();
            ev.dispatch(EV_1);
            expect(l1.callCount).to.equal(0);
        });

        it("should not call any listeners on any event.", () => {
            const l1 = fake();
            const l2 = fake();
            ev.takeEvery(EV_1.type, l1);
            ev.takeEvery(EV_2.type, l2);
            ev.cancelAll();
            ev.dispatch(EV_1);
            ev.dispatch(EV_2);
            expect(l1.callCount).to.equal(0);
            expect(l2.callCount).to.equal(0);
        });
    });

    describe("dispatch", () => {
        it("should call multiple on listeners", () => {
            const l1 = fake();
            const l2 = fake();
            const l3 = fake();
            ev.takeEvery(EV_1.type, l1);
            ev.takeEvery(EV_1.type, l2);
            ev.takeEvery(EV_1.type, l3);
            ev.dispatch(EV_1);
            expect(l1.callCount).to.equal(1);
            expect(l2.callCount).to.equal(1);
            expect(l3.callCount).to.equal(1);
            expect(l1.calledWithExactly(EV_1)).to.be.true;
            expect(l2.calledWithExactly(EV_1)).to.be.true;
            expect(l3.calledWithExactly(EV_1)).to.be.true;
        });

        it("should call multiple once listeners", () => {
            const l1 = fake();
            const l2 = fake();
            const l3 = fake();
            ev.takeOne(EV_1.type, l1);
            ev.takeOne(EV_1.type, l2);
            ev.takeOne(EV_1.type, l3);
            ev.dispatch(EV_1);
            expect(l1.callCount).to.equal(1);
            expect(l2.callCount).to.equal(1);
            expect(l3.callCount).to.equal(1);
            expect(l1.calledWithExactly(EV_1)).to.be.true;
            expect(l2.calledWithExactly(EV_1)).to.be.true;
            expect(l3.calledWithExactly(EV_1)).to.be.true;
        });

        it("should call mix listeners", () => {
            const l1 = fake();
            const l2 = fake();
            const l3 = fake();
            ev.takeEvery(EV_1.type, l1);
            ev.takeOne(EV_1.type, l2);
            ev.takeEvery(EV_1.type, l3);
            ev.dispatch(EV_1);
            expect(l1.callCount).to.equal(1);
            expect(l2.callCount).to.equal(1);
            expect(l3.callCount).to.equal(1);
            expect(l1.calledWithExactly(EV_1)).to.be.true;
            expect(l2.calledWithExactly(EV_1)).to.be.true;
            expect(l3.calledWithExactly(EV_1)).to.be.true;
        });

        it("should not fail if no listeners is not found", () => {
            const l1 = fake();
            const l2 = fake();
            ev.takeEvery(EV_1.type, l1);
            ev.takeOne(EV_2.type, l2);
            ev.dispatch(EV_3);
            expect(l1.callCount).to.equal(0);
            expect(l2.callCount).to.equal(0);
        });
    });
});
