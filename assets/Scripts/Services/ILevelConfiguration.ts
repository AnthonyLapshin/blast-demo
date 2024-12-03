import { Dictionary } from "../Libs/Injects/shared/Dictionary";

export interface ILevelConfigurationService {
    get width(): number ;
    get height(): number;
    get cellWidth(): number;
    get cellHeight(): number;
    get paytable(): Record<string, number>;
}