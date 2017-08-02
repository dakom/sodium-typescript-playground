
import { Cell, Stream, StreamSink, Transaction } from "sodiumjs";
import { expect } from 'chai';

export class MappingTest {
    constructor() {
        describe('Mapping', () => {
            new _MappingTest();
        });

    }
}

class _MappingTest {
    constructor() {
        let idx = 0;
        const expectedOrder = [
            true,
            false,
            false,
            true,
            true,
            false,
            true
        ]
        const sStart = new StreamSink<void>();
        const sEnd = new StreamSink<void>();

        const cEnabled = sStart
            .map(n => false)
            .orElse(
            sEnd.map(n => true)
            ).hold(true)


        cEnabled.listen(flag => {
            const expectedFlag = expectedOrder[idx++];

            it((expectedFlag ? "true" : "false"), (done) => {
                expect(flag).to.equal(expectedFlag);
                done();
            });
        });


        sStart.send(undefined);
        sStart.send(undefined);
        sEnd.send(undefined);
        sEnd.send(undefined);
        sStart.send(undefined);
        sEnd.send(undefined);
    }
}
