/* tslint:disable:no-unused-expression */
import "mocha";
import { EventEmitter } from "./eventemitter";
import { expect } from "chai";
import { fake } from "sinon";

const EV_1 = "EV_1";
const EV_2 = "EV_2";
const EV_3 = "EV_3";

const ARG_1 = "ARG_1";
const ARG_2 = "ARG_2";
const ARG_3 = "ARG_3";

describe("EventEmitter", () => {
    let ev: EventEmitter = null;

    beforeEach(() => {
        ev = new EventEmitter();
    });

    describe("on", () => {
        it("should call listener when event is emitted.", () => {
            const l1 = fake();
            ev.on(EV_1, l1);
            ev.emit(EV_1);
            expect(l1.callCount).to.equal(1);
            expect(l1.alwaysCalledWithExactly()).to.be.true;
        });

        it("should only call listener that is subscribed to that event.", () => {
            const l1 = fake();
            const l2 = fake();
            ev.on(EV_1, l1);
            ev.on(EV_2, l2);
            ev.emit(EV_1);
            expect(l1.callCount).to.equal(1);
            expect(l1.alwaysCalledWithExactly()).to.be.true;
            expect(l2.called).to.be.false;
        });

        it("should call multiple listeners that are subscribed.", () => {
            const l1 = fake();
            const l2 = fake();
            ev.on(EV_1, l1);
            ev.on(EV_1, l2);
            ev.emit(EV_1);
            expect(l1.callCount).to.equal(1);
            expect(l1.alwaysCalledWithExactly()).to.be.true;
            expect(l2.callCount).to.equal(1);
            expect(l2.alwaysCalledWithExactly()).to.be.true;
        });

        it("should call listener multiple times when event is emitted multiple times.", () => {
            const l1 = fake();
            ev.on(EV_1, l1);
            ev.emit(EV_1);
            ev.emit(EV_1);
            ev.emit(EV_1);
            expect(l1.callCount).to.equal(3);
            expect(l1.alwaysCalledWithExactly()).to.be.true;
        });

        it("should not call listener if same listener removed", () => {
            const l1 = fake();
            const removal = ev.on(EV_1, l1);
            removal();
            ev.emit(EV_1, ARG_1);
            expect(l1.called).to.be.false;
        });
    });

    describe("once", () => {
        it("should call listener when event is emitted.", () => {
            const l1 = fake();
            ev.once(EV_1, l1);
            ev.emit(EV_1);
            expect(l1.callCount).to.equal(1);
            expect(l1.alwaysCalledWithExactly()).to.be.true;
        });

        it("should only call listener that is subscribed to that event.", () => {
            const l1 = fake();
            const l2 = fake();
            ev.once(EV_1, l1);
            ev.once(EV_2, l2);
            ev.emit(EV_1);
            expect(l1.callCount).to.equal(1);
            expect(l1.alwaysCalledWithExactly()).to.be.true;
            expect(l2.called).to.be.false;
        });

        it("should call multiple listeners that are subscribed.", () => {
            const l1 = fake();
            const l2 = fake();
            ev.once(EV_1, l1);
            ev.once(EV_1, l2);
            ev.emit(EV_1);
            expect(l1.callCount).to.equal(1);
            expect(l1.alwaysCalledWithExactly()).to.be.true;
            expect(l2.callCount).to.equal(1);
            expect(l2.alwaysCalledWithExactly()).to.be.true;
        });

        it("should call listener once when event is emitted multiple times.", () => {
            const l1 = fake();
            ev.once(EV_1, l1);
            ev.emit(EV_1);
            ev.emit(EV_1);
            ev.emit(EV_1);
            expect(l1.callCount).to.equal(1);
            expect(l1.alwaysCalledWithExactly()).to.be.true;
        });

        it("should not call listener if same listener removed", () => {
            const l1 = fake();
            const removal = ev.once(EV_1, l1);
            removal();
            ev.emit(EV_1, ARG_1);
            expect(l1.called).to.be.false;
        });
    });

    describe("removeListener", () => {
        it("should not call listener that is removed.", () => {
            const l1 = fake();
            ev.on(EV_1, l1);
            ev.removeListener(EV_1, l1);
            ev.emit(EV_1);
            expect(l1.callCount).to.equal(0);
        });

        it("should call other listeners if single listener is removed.", () => {
            const l1 = fake();
            const l2 = fake();
            ev.on(EV_1, l1);
            ev.on(EV_1, l2);
            ev.removeListener(EV_1, l1);
            ev.emit(EV_1);
            expect(l1.callCount).to.equal(0);
            expect(l2.callCount).to.equal(1);
            expect(l2.alwaysCalledWithExactly()).to.be.true;
        });

        it("should not fail if listener is not found", () => {
            const l1 = fake();
            const l2 = fake();
            ev.on(EV_1, l2);
            ev.removeListener(EV_1, l1);
            expect(l1.callCount).to.equal(0);
            expect(l2.callCount).to.equal(0);
        });

        it("should not fail if event is not found", () => {
            const l1 = fake();
            ev.removeListener(EV_1, l1);
            expect(l1.callCount).to.equal(0);
        });
    });

    describe("removeAllListeners", () => {
        it("should not call any listener on single event.", () => {
            const l1 = fake();
            ev.on(EV_1, l1);
            ev.removeAllListeners();
            ev.emit(EV_1);
            expect(l1.callCount).to.equal(0);
        });

        it("should not call any listeners on any event.", () => {
            const l1 = fake();
            const l2 = fake();
            ev.on(EV_1, l1);
            ev.on(EV_2, l2);
            ev.removeAllListeners();
            ev.emit(EV_1);
            ev.emit(EV_2);
            expect(l1.callCount).to.equal(0);
            expect(l2.callCount).to.equal(0);
        });
    });

    describe("emit", () => {
        it("should call multiple on listeners", () => {
            const l1 = fake();
            const l2 = fake();
            const l3 = fake();
            ev.on(EV_1, l1);
            ev.on(EV_1, l2);
            ev.on(EV_1, l3);
            ev.emit(EV_1, ARG_1);
            expect(l1.callCount).to.equal(1);
            expect(l2.callCount).to.equal(1);
            expect(l3.callCount).to.equal(1);
            expect(l1.calledWithExactly(ARG_1)).to.be.true;
            expect(l2.calledWithExactly(ARG_1)).to.be.true;
            expect(l3.calledWithExactly(ARG_1)).to.be.true;
        });

        it("should call multiple once listeners", () => {
            const l1 = fake();
            const l2 = fake();
            const l3 = fake();
            ev.once(EV_1, l1);
            ev.once(EV_1, l2);
            ev.once(EV_1, l3);
            ev.emit(EV_1, ARG_1);
            expect(l1.callCount).to.equal(1);
            expect(l2.callCount).to.equal(1);
            expect(l3.callCount).to.equal(1);
            expect(l1.calledWithExactly(ARG_1)).to.be.true;
            expect(l2.calledWithExactly(ARG_1)).to.be.true;
            expect(l3.calledWithExactly(ARG_1)).to.be.true;
        });

        it("should call mix listeners", () => {
            const l1 = fake();
            const l2 = fake();
            const l3 = fake();
            ev.once(EV_1, l1);
            ev.on(EV_1, l2);
            ev.once(EV_1, l3);
            ev.emit(EV_1, ARG_1);
            expect(l1.callCount).to.equal(1);
            expect(l2.callCount).to.equal(1);
            expect(l3.callCount).to.equal(1);
            expect(l1.calledWithExactly(ARG_1)).to.be.true;
            expect(l2.calledWithExactly(ARG_1)).to.be.true;
            expect(l3.calledWithExactly(ARG_1)).to.be.true;
        });

        it("should pass argument to on listener when passed argument", () => {
            const l1 = fake();
            ev.on(EV_1, l1);
            ev.emit(EV_1, ARG_1, ARG_2, ARG_3);
            expect(l1.callCount).to.equal(1);
            expect(l1.alwaysCalledWithExactly(ARG_1, ARG_2, ARG_3)).to.be.true;
        });

        it("should pass argument to once listener when passed argument", () => {
            const l1 = fake();
            ev.once(EV_1, l1);
            ev.emit(EV_1, ARG_1, ARG_2, ARG_3);
            expect(l1.callCount).to.equal(1);
            expect(l1.alwaysCalledWithExactly(ARG_1, ARG_2, ARG_3)).to.be.true;
        });

        it("should not fail if no listeners is not found", () => {
            const l1 = fake();
            const l2 = fake();
            ev.on(EV_1, l1);
            ev.once(EV_2, l2);
            ev.emit(EV_3);
            expect(l1.callCount).to.equal(0);
            expect(l2.callCount).to.equal(0);
        });
    });
});
