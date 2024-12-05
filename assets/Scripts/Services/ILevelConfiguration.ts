import { Dictionary } from "../Libs/Injects/shared/Dictionary";

export interface ILevelConfigurationService {
    get width(): number ;
    get height(): number;
    get cellWidth(): number;
    get cellHeight(): number;
    get paytable(): Record<string, number>;
    get maxMoves(): number;
    get targetScore(): number;
    get bombRadius(): Record<string, number>;
    get drops(): Record<number, string[]> ;
}