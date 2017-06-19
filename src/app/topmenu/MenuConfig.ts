import { List } from "immutable";

export class MenuConfig {
    constructor(public readonly label: string) { }
}

export function GetMenuConfig(): List<MenuConfig> {
    return List<MenuConfig>([
        new MenuConfig("bunnies - baseline"),
        new MenuConfig("bunnies - frp"),
        new MenuConfig("draw"),
        new MenuConfig("pong")
    ]);
}
