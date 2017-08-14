import * as FL from "fantasy-land";
import { Cell, Stream, StreamSink, Transaction } from "sodiumjs";
import { expect } from 'chai';

export class FantasyLandTest {
    constructor() {
        describe("Fantasyland Laws Tests", () => {
            describe("Cell", () => {
                new CellTests();
            });

            describe("Stream", () => {
                new StreamTests();
            });
        });
    }
}

class CellTests {
    constructor() {
        describe("Functor", () => {
            this.Functor();
        });
        describe("Apply", () => {
            this.Apply();
        });
        describe("Applicative", () => {
            this.Applicative();
        });
        describe("Monad", () => {
            this.Monad();
        });
    }

    Functor() {
    }

    Apply() {
        //TODO: replace with actual laws
        const compose = f => g => x => f(g(x));
        const y = new Cell<(t: any) => any>(t => t);

        const a = y[FL.ap](y[FL.ap](y[FL.map](compose)));
        const b = y[FL.ap](y)[FL.ap](y);

        it("core logic", (done) => {
            expect(a.sample()).to.equal(b.sample());
            done();
        });
    }

    Applicative() {

    }

    Monad() {

    }
}

class StreamTests {
    constructor() {
        describe("Functor", () => {
            this.Functor();
        });
    }
    Functor() {
    }

}