
import { Cell, Stream, StreamSink, Transaction } from "sodiumjs";
import { expect } from 'chai';

export class MappingTest {
    'Mapping'(done) {
        checkOrder(done);
    }
}

function checkOrder(done) {
    let idx = 0;
    const expectedOrder = [
        true,
        false,
        false,
        true,
        true,
        false,
        true
    ];
    const out = [];
    const sStart = new StreamSink<void>();
    const sEnd = new StreamSink<void>();

    const cEnabled = sStart
        .map(n => false)
        .orElse(
        sEnd.map(n => true)
        ).hold(true)


    cEnabled.listen(flag => {
        expect(flag).to.equal(expectedOrder[out.length]);
        out.push(flag);
        if(out.length === expectedOrder.length) {
            done();
        }
    });


    sStart.send(undefined);
    sStart.send(undefined);
    sEnd.send(undefined);
    sEnd.send(undefined);
    sStart.send(undefined);
    sEnd.send(undefined);
}

