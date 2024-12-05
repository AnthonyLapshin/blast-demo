/**
 * @file ISelectedItemData.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

import { Vec2 } from "cc";
import { GameFieldItem } from "../../GameField/GameFieldItem";

/**
 * Interface defining the contract for selected item data.
 * Provides access to essential information about a selected game item,
 * including its position and properties.
 */
export interface ISelectedItemData {
    /** The position of the selected item in the grid */
    get position(): Vec2;
    set position(value: Vec2);

    /** Reference to the actual game field item */
    get item(): GameFieldItem;
    set item(value: GameFieldItem);
}