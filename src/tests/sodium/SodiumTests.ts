import { GateTest }from "./gate/GateTest";

export class SodiumTests {
    constructor() {
        describe('Sodium', () => {
            new GateTest();
        });
        
    }
}