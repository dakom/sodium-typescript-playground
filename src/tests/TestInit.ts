
import {SodiumTests} from "./sodium/SodiumTests";
import {TempTest} from "./temp/TempTest";
import {FunctionalLibrariesTest} from "./functional-libraries/FunctionalLibrariesTest";
import {FantasyLandTest} from "./fantasyland/FantasyLandTest";
import { expect } from 'chai';


class TesterInit {
    
    constructor() {
       describe('init', () => {
            it('should pass', () => {
                expect(1+1).to.equal(2);
            });
       });

       new TempTest();
       new FantasyLandTest();
       new FunctionalLibrariesTest();
       new SodiumTests();
    }
}

new TesterInit();



