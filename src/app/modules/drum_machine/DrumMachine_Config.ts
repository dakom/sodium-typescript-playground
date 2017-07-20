export const sampleIds = ["bass", "snare", "cymbal", "hihat"];

export const startSpeed = .56;

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