
import { Cell, Stream, StreamSink, Transaction } from "sodiumjs";
import { expect } from 'chai';
import * as S from "sanctuary";
import * as R from "ramda";
import * as FL from "fantasy-land";

export class SodiumFantasylandTest {
    constructor() {
        describe('Mapping', () => {
            new _MappingTest();
        });

    }
}

class _MappingTest {
    constructor() {
        const cOne = new Cell<number>(1);

        //const cTwo = R.map(n => n+1, cOne);
        const cTwo = S.map(n => n+1, cOne);
        
        cTwo.listen(n => {
            it("should equal two", (done) => {
                expect(n).to.equal(2);
                done();
            });
        });
    }
}
