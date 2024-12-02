import { IGameConfigurationService } from "./IGameConfigurationService";
import { singleton } from "../Libs/Injects/decorators/singleton";

@singleton()
export class GameConfigurationService implements IGameConfigurationService {
    private _reshuffles: number = 3;
    private _minClusterSize: number = 4;

    public get reshuffles(): number {
        return this._reshuffles;
    }

    public get minClusterSize(): number {
        return this._minClusterSize;
    }
}