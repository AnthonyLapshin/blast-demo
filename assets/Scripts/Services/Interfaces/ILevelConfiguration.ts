import { Dictionary } from "../../Libs/Injects/shared/Dictionary";
import { GameFieldItem } from "../../GameField/GameFieldItem";

/**
 * Interface defining the service responsible for managing level-specific configuration settings.
 * This service provides access to level parameters such as target score, maximum moves,
 * and level-specific game field configurations.
 */
export interface ILevelConfigurationService {
    /**
     * The width of the game field for this level.
     * @returns The width of the field in cells
     */
    get width(): number ;

    /**
     * The height of the game field for this level.
     * @returns The height of the field in cells
     */
    get height(): number;

    /**
     * The width of a single cell in the game field.
     * @returns The width of a cell in pixels
     */
    get cellWidth(): number;

    /**
     * The height of a single cell in the game field.
     * @returns The height of a cell in pixels
     */
    get cellHeight(): number;

    /**
     * The paytable configuration for this level.
     * @returns A dictionary mapping game field items to their respective scores
     */
    get paytable(): Record<string, number>;

    /**
     * The maximum number of moves allowed in the level.
     */
    readonly maxMoves: number;

    /**
     * The target score required to complete the level.
     */
    readonly targetScore: number;

    /**
     * The bomb radius configuration for this level.
     * @returns A dictionary mapping bomb types to their respective explosion radii
     */
    get bombRadius(): Record<string, number>;

    /**
     * The drops configuration for this level.
     * @returns A dictionary mapping drop probabilities to their respective game field items
     */
    get drops(): Record<number, string[]> ;
}