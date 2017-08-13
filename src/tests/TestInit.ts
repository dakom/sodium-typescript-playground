
import {SodiumTests} from "./sodium/SodiumTests";
import {TempTest} from "./temp/TempTest";
import {MonkeyPatchTest} from "./monkeypatch/MonkeyPatchTest"
import { expect } from 'chai';

//setup temp monkeypatching
import {SodiumFantasyland} from "../monkeypatch/SodiumFantasyLand-MonkeyPatch";
SodiumFantasyland();

class TesterInit {
    
    constructor() {
       describe('init', () => {
            it('should pass', () => {
                expect(1+1).to.equal(2);
            });
       });

       new TempTest();
       new MonkeyPatchTest();
       new SodiumTests();
    }
}

new TesterInit();



