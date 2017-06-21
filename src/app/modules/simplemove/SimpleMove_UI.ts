export function createBall(x: number, y: number): PIXI.Graphics {
    let graphics = new PIXI.Graphics();
    graphics.beginFill(0xFF0000);
    graphics.drawCircle(0, 0, 40);
    graphics.endFill();
    graphics.x = x;
    graphics.y = y;
    //graphics.interactive = graphics.buttonMode = true;
    return graphics;
}