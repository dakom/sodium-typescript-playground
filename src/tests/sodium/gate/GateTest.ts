import { Cell, Stream, StreamSink, Transaction } from "sodiumjs";
import { expect } from 'chai';

const MIN = 2;
const MAX = 10;

function validate(n): boolean {
    return (n >= MIN && n <= MAX);
}

class Test {
    protected sUpdate:StreamSink<number>;
    protected sValidated:Stream<number>;

    constructor(private label:string) {
        //console.log("---" + label + "---");
        this.sUpdate = new StreamSink<number>();
    }

    public run(targetVal:number, testLabel:string) {
        //this.sUpdate.listen(n => console.log("updated value", n));

        this.sValidated.listen(n => {
            it(this.label + " test " + testLabel, (done) => {
               // console.log("VALIDATED VALUE", n);
                expect(n).to.equal(targetVal);
                done();
            });
        });

        this.sUpdate.send(0);
        this.sUpdate.send(5);
        this.sUpdate.send(11);
        //console.log("");
    }
}

class TestViaFilter extends Test {
    constructor() {
        super("filter");
        
        this.sValidated = this.sUpdate
            .map(n => validate(n) ? n : null)
            .filterNotNull();

        this.run(5, "should be the correctly filtered value 5");
    }
}

class TestViaGate extends Test {
    constructor() {
        super("gate");
        
        const cGate = this.sUpdate
            .map(n => validate(n))
            .hold(false);

        this.sValidated = this.sUpdate.gate(cGate);

        this.run(11, "should be the delayed value (due to stale gate), 11");
    }
}

export class GateTest {
    constructor() {
        describe('Gate vs. Filter', () => {
            new TestViaFilter();
            new TestViaGate();
        });
    }
}