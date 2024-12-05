/**
 * @file IGameContext.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

import { Prefab, Node } from "cc";
import { GameFieldItem } from "../../../../GameField/GameFieldItem";
import { IGameConfigurationService } from "../../../../Services/Interfaces/IGameConfigurationService";
import { ILevelConfigurationService } from "../../../../Services/Interfaces/ILevelConfiguration";
import { SelectedItemData } from "../../../Base/SelectedItemData";
import { GameTool } from "../../../EnumGameTool";

/**
 * Interface defining the contract for the game context.
 * Provides access to essential game state information and operations
 * that are needed across different components of the game.
 */
export interface IGameContext {

    /**
     * Gets or sets the current game tool being used.
     */
    get currentTool(): GameTool;
    set currentTool(value: GameTool);

    /**
     * Flag indicating if the player is out of moves.
     */
    get outOfMoves(): boolean;

    /**
     * Flag indicating if the point target has been reached.
     */
    get pointTargetReached(): boolean;

    /**
     * Gets or sets the current game score.
     */
    get gameScore(): number
    set gameScore(value: number)

    /**
     * Gets or sets the current game field items in a 2D array.
     */
    get items(): GameFieldItem[][];
    set items(value: GameFieldItem[][]);

    /**
     * Gets the level configuration service.
     */
    get lvlConf(): ILevelConfigurationService;

    /**
     * Gets the game configuration service.
     */
    get gameConf(): IGameConfigurationService;

    /**
     * Gets or sets the prefabs for game items.
     */
    get itemPrefabs(): Prefab[];
    set itemPrefabs(value: Prefab[]);

    /**
     * Gets or sets the pool of game items.
     */
    get itemsPool(): GameFieldItem[];
    set itemsPool(value: GameFieldItem[]);

    /**
     * Gets or sets the game node.
     */
    get gameNode(): Node ;
    set gameNode(value: Node);

    /**
     * Gets or sets the currently selected item on the field.
     */
    get selectedItem(): SelectedItemData ;
    set selectedItem(value: SelectedItemData) ;

    /**
     * Gets or sets the current cluster of items being processed.
     */
    get currentCluster(): GameFieldItem[];
    set currentCluster(value: GameFieldItem[]);

    /**
     * Flag indicating if items are currently being moved.
     */
    get isMovingItems(): boolean;
    set isMovingItems(value: boolean);

    /**
     * Gets or sets the pool of dropped items.
     */
    get dropsPool(): GameFieldItem[];
    set dropsPool(value: GameFieldItem[]);

    /**
     * Gets or sets the prefabs for dropped items.
     */
    get dropPrefabs(): Prefab[];
    set dropPrefabs(value: Prefab[]);

    /**
     * Gets or sets the dropped items.
     */
    get droppedItems(): SelectedItemData[];
    set droppedItems(value: SelectedItemData[]);

    /**
     * Flag indicating if the player should skip a move.
     */
    get skipMove(): boolean;
    set skipMove(value: boolean);
}