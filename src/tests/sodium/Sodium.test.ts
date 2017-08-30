import { GateTest }from "./gate/GateTest";
import { MappingTest} from "./map/Mapping.test";

export class SodiumTests {
    'Sodium'() {
        new GateTest();
        new MappingTest();
    }
}