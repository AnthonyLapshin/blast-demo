/**
 * Interface defining the service responsible for managing game-wide configuration settings.
 * This service provides access to various game parameters and settings that affect gameplay.
 */
export interface IGameConfigurationService {
    /**
     * The minimum number of items required to form a valid cluster.
     */
    readonly minClusterSize: number;

    /**
     * The number of reshuffles allowed in the game.
     */
    get reshuffles(): number;

    /**
     * The initial number of points awarded to the player at the start of the game.
     */
    get startPointsAmount(): number;
    set startPointsAmount(value: number);
}