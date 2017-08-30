
import {SodiumTests} from "./sodium/Sodium.test";

import { expect } from 'chai';

export class TesterInit {
    'init'() {
        new SodiumTests();
    }
}

new TesterInit();



