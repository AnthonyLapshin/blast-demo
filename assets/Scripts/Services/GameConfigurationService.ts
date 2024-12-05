import { IGameConfigurationService } from "./Interfaces/IGameConfigurationService";
import { singleton } from "../Libs/Injects/decorators/singleton";

/**
 * Service that provides game configuration settings.
 * This service manages global game settings such as animation durations,
 * reshuffle limits, and other game-wide parameters.
 */
@singleton()
export class GameConfigurationService implements IGameConfigurationService {
    /** Maximum number of reshuffles allowed */
    private readonly _reshuffles: number = 3;
    private _minClusterSize: number = 4;
    private _startPointsAmount: number = 0;
    
    /**
     * Gets the maximum number of reshuffles allowed.
     */
    public get reshuffles(): number {
        return this._reshuffles;
    }

    /**
     * Gets the minimum cluster size.
     */
    public get minClusterSize(): number {
        return this._minClusterSize;
    }

    /**
     * Gets the start points amount.
     */
    public get startPointsAmount(): number {
        return this._startPointsAmount;
    }
    /**
     * Sets the start points amount.
     */
    public set startPointsAmount(value: number) {
        this._startPointsAmount = value;
    }
}