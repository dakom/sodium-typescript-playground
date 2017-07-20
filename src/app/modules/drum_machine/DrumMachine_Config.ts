export const sampleIds = ["bass", "snare", "cymbal", "hihat"];
import { Direction, SliderOptions } from "../../../lib/slider/Slider";
export function RowConfig(rowIndex: number): Array<number> {
    switch (rowIndex) {
        case 0: //bass
            return [0, 10];
        case 1: //snare
            return [4, 12];
        case 2: //cymbal
            return [];
        case 3: //hihat
            return [2,7,9,12];

    }
    return [];
}

export function VolumeSliderOptions(size: number): SliderOptions {
        return {
            initPerc: .7,
            dir: Direction.VERTICAL,
            knob: {
                radius: 25,
                color: 0xFF0000
            },
            track: {
                sizeX: 50,
                sizeY: size,
                color: 0x00ff00
            }
        }
}

export function SpeedSliderOptions(size: number): SliderOptions {
        return {
            initPerc: .5,
            dir: Direction.HORIZONTAL,
            knob: {
                radius: 25,
                color: 0xFF0000
            },
            track: {
                sizeX: size,
                sizeY: 50,
                color: 0x00ff00
            }
        }
}