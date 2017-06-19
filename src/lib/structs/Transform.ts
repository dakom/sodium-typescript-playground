export class Transform {
    constructor(
        public readonly id: number,
        public readonly x: number,
        public readonly y: number,
        public readonly scaleX: number,
        public readonly scaleY: number,
        public readonly rotation: number
    ) { }
}