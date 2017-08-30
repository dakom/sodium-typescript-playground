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
        console.log("---" + label + "---");
        this.sUpdate = new StreamSink<number>();
    }
}


class TestViaGate extends Test {
    constructor() {
        super("gate");
    }

    "should be the delayed value (due to stale gate), 11"(done) {
        const cGate = this.sUpdate
            .map(n => validate(n))
            .hold(false);

        this.sValidated = this.sUpdate.gate(cGate);

        this.sUpdate.listen(n => console.log("updated value", n));
        
                this.sValidated.listen(n => {
                    console.log("VALIDATED VALUE", n);
                    expect(n).to.equal(11);
                    done();
                });
        
                this.sUpdate.send(0);
                this.sUpdate.send(5);
                this.sUpdate.send(11);
                console.log("");
    }
    
}

class TestViaFilter extends Test {
    constructor() {
        super("filter");
    }
    
    "should be the correctly filtered value 5"(done) {
        this.sValidated = this.sUpdate
            .map(n => validate(n) ? n : null)
            .filterNotNull();

        this.sUpdate.listen(n => console.log("updated value", n));
        
                this.sValidated.listen(n => {
                    console.log("VALIDATED VALUE", n);
                    expect(n).to.equal(5);
                    done();
                });
        
                this.sUpdate.send(0);
                this.sUpdate.send(5);
                this.sUpdate.send(11);
                console.log("");
    }
    
}

export class GateTest {
    'Gate vs. Filter'(){
        new TestViaFilter();
        new TestViaGate();
    }
}