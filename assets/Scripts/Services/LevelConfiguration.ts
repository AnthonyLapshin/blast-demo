import { GameFieldItem } from "../GameField/GameFieldItem";
import { singleton } from "../Libs/Injects/decorators/singleton";
import { ILevelConfigurationService } from "./Interfaces/ILevelConfiguration";

/**
 * Service that provides level-specific configuration settings.
 * This service manages settings like grid dimensions, scoring rules,
 * tool properties, and level completion criteria.
 */
@singleton()
export class LevelConfigurationService implements ILevelConfigurationService {

    /** Width of the game grid in cells */
    private readonly _width: number = 10;
    /** Height of the game grid in cells */
    private readonly _height: number = 10;
    /** Width of each cell in pixels */
    private readonly _cellWidth: number = 171;
    /** Height of each cell in pixels */
    private readonly _cellHeight: number = 192;
    /** Map of points awarded for each item in the game */
    private readonly _paytable: Record<string, number> = {
        "BlueItem": 10,
        "GreenItem": 20,
        "PurpleItem": 30,
        "RedItem": 40,
        "YellowItem": 50,
        // Boosters
        "COL_ROCKET_1": 60,
        "ROW_ROCKET_1": 60,
        "COL_ROCKET_2": 60,
        "ROW_ROCKET_2": 60,
        "NUKE_BOMB": 100
    };

    /**
     * Map of items that can be dropped at specific levels.
     */
    private readonly _drops: Record<number, string[]> = {
        6: ["COL_ROCKET_1", "ROW_ROCKET_1"],
        7: ["COL_ROCKET_2", "ROW_ROCKET_2"],
        8: ["NUKE_BOMB"],
    };

    /** Maximum moves allowed in the level */
    private readonly _maxMoves: number = 15;
    /** Target score to complete the level */
    private readonly _targetScore: number = 15500;

    /**
     * Map of bomb radiuses for different tools.
     */
    private readonly _bombRadius: Record<string, number> = {
        "BOMB_1": 1,
        "BOMB_2": 2,
    };

    /**
     * Gets the map of items that can be dropped at specific levels.
     */
    public get drops(): Record<number, string[]> {
        return this._drops;
    }

    /**
     * Gets the map of bomb radiuses.
     */
    public get bombRadius(): Record<string, number> {
        return this._bombRadius;
    }

    /**
     * Gets the maximum moves allowed.
     */
    public get maxMoves(): number{
        return this._maxMoves;
    }
    
    /**
     * Gets the target score for level completion.
     */
    public get targetScore(): number{
        return this._targetScore;
    }

    /**
     * Gets the map of points awarded for each item.
     */
    public get paytable(): Record<string, number> {
        return this._paytable;
    }
    
    /**
     * Gets the width of the game grid.
     */
    public get width(): number{
        return this._width;
    }

    /**
     * Gets the height of the game grid.
     */
    public get height(): number{
        return this._height;
    }

    /**
     * Gets the width of each cell.
     */
    public get cellWidth(): number{
        return this._cellWidth;
    }
    /**
     * Gets the height of each cell.
     */
    public get cellHeight(): number{
        return this._cellHeight;
    }
}