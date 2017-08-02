import { GateTest }from "./gate/GateTest";
import { MappingTest} from "./map/MappingTest";

export class SodiumTests {
    constructor() {
        describe('Sodium', () => {
            new GateTest();
            new MappingTest();
        });
        
    }
}