export class MenuConfig {
    constructor(public readonly id:string, public readonly label?: string) { 
        if(label === undefined) {
            this.label = id;
        }
    }
}

export const Configs = [
            new MenuConfig("simple"),
            new MenuConfig("bunnies"),
            new MenuConfig("draw"),
            new MenuConfig("pong")
];