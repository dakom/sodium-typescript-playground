import { Cell, Stream, StreamSink, Transaction } from "sodiumjs";
import { expect } from 'chai';

export class GateTest {
    'Gate vs. Filter - Filter'(done) {
        const sUpdate = new StreamSink<number>();

        const sValidated = sUpdate
            .map(n => validate(n) ? n : null)
            .filterNotNull();

        run(5, "should be the correctly filtered value: ", done, sUpdate, sValidated, );
    }

    'Gate vs. Filter - Gate'(done) {
        const sUpdate = new StreamSink<number>();

        const cGate = sUpdate
            .map(n => validate(n))
            .hold(false);

        const sValidated = sUpdate.gate(cGate);

        run(11, "should be the delayed value (due to stale gate): ", done, sUpdate, sValidated);
    }
}

function run(targetVal: number, testLabel: string, done: () => void, sUpdate: StreamSink<number>, sValidated: Stream<number>) {

    const out = [];

    //sUpdate.listen(n => console.log("updated value", n));

    sValidated.listen(n => {
        //console.log(testLabel + targetVal);
        //console.log("VALIDATED VALUE", n);
        expect(n).to.equal(targetVal);
        done();
    });

    sUpdate.send(0);
    sUpdate.send(5);
    sUpdate.send(11);
    //console.log("");
}

const MIN = 2;
const MAX = 10;

function validate(n): boolean {
    return (n >= MIN && n <= MAX);
}