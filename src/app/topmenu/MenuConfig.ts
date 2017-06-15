export class MenuConfig {
    constructor(public label:string) {}
}

export const MenuConfigs:Array<MenuConfig> = [
    new MenuConfig("bunnies - baseline"),
    new MenuConfig("bunnies - frp"),
    new MenuConfig("draw"),
    new MenuConfig("pong")
]