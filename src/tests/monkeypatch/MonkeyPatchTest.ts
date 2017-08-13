
import { SodiumFantasylandTest} from "./sodium-fantasyland/SodiumFantasylandTest";

export class MonkeyPatchTest {
    constructor() {
        describe('MonkeyPatch', () => {
            new SodiumFantasylandTest();
        });
        
    }
}