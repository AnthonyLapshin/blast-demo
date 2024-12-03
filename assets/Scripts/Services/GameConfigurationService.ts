import { IGameConfigurationService } from "./IGameConfigurationService";
import { singleton } from "../Libs/Injects/decorators/singleton";

@singleton()
export class GameConfigurationService implements IGameConfigurationService {
    private _reshuffles: number = 3;
    private _minClusterSize: number = 4;
    private _startPointsAmount: number = 0;
    
    public get startPointsAmount(): number {
        return this._startPointsAmount;
    }
    public set startPointsAmount(value: number) {
        this._startPointsAmount = value;
    }

    public get reshuffles(): number {
        return this._reshuffles;
    }

    public get minClusterSize(): number {
        return this._minClusterSize;
    }
}