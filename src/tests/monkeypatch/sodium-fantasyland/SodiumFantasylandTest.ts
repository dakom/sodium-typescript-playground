//see https://github.com/ramda/ramda/issues/1650

import { Cell, Stream, StreamSink, Transaction } from "sodiumjs";
import { expect } from 'chai';
import { create, env } from 'sanctuary';
import * as R from "ramda";
import * as FL from "fantasy-land";

declare const NODE_ENV: string;

//required unless we also define Sanctuary types
const S = create({
    checkTypes: false,
    env,
});

//monkey-patching
Cell.prototype[FL.map] = Cell.prototype.map;
Cell.prototype[FL.ap] = function (val) {
    return Cell.apply(val, this);
}
Cell[FL.of] = v => new Cell(v);


//Main

let lib;
export class SodiumFantasylandTest {
    constructor() {
        [R, S].forEach(l => {
            lib = l;
            const label = (l === R) ? "Ramda" : "Sanctuary";

            describe(label + ' Functor', () => {
                new _FunctorTest();
            });
            describe(label + ' Apply', () => {
                new _ApplyTest();
            });
            describe(label + ' Applicative', () => {
                new _ApplicativeTest();
            });
        });
        
    }
}

class _ApplicativeTest {
    constructor() {
        const aCells = new Array<Cell<number>>(new Cell<number>(1), new Cell<number>(2), new Cell<number>(3));
        const cArrays = lib.sequence(Cell[FL.of], aCells);

        cArrays.listen(nArr => {
            it("array should have correct values", (done) => {
                expect(nArr).to.deep.equal([1, 2, 3])
                done();
            });
        });
    }
}

class _ApplyTest {
    constructor() {
        this.testEquivilency();
        this.testLift();
    }

    testEquivilency() {
        const compose = f => g => x => f(g(x));
        const y = new Cell<(t: any) => any>(t => t);

        const a = y[FL.ap](y[FL.ap](y[FL.map](compose)));
        const b = y[FL.ap](y)[FL.ap](y);

        it("applicatives should equal composition", (done) => {
            expect(a.sample()).to.equal(b.sample());
            done();
        });

    }
    testLift() {
        const addA = (lib === R) ? lib.lift(lib.add) : lib.lift2(lib.add);

        const cResult = addA(new Cell<number>(2), new Cell<number>(3));
        cResult.listen(n => {
            it("lift result in 5", (done) => {
                expect(n).to.equal(5);
                done();
            });
        });
    }
}

class _FunctorTest {
    constructor() {
        this.style1();
        this.style2();
    }

    style1() {
        const inc = lib.add(1);
        const cTwo = lib.map(inc, new Cell<number>(1));
        cTwo.listen(n => {
            it("mapping (style 1) should equal two", (done) => {
                expect(n).to.equal(2);
                done();
            });
        });
    }

    style2() {
        const inc = lib.add(1);

        const cTwo = new Cell<number>(1)[FL.map](inc);
        cTwo.listen(n => {
            it("mapping (style 2) should equal two", (done) => {
                expect(n).to.equal(2);
                done();
            });
        });
    }
}