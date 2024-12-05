/**
 * @file SelectedItemData.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

import { Vec2 } from "cc";
import { ISelectedItemData } from "./ISelectedItemData";
import { GameFieldItem } from "../../GameField/GameFieldItem";

/**
 * Represents data about a selected item in the game field.
 * This class encapsulates information about an item that has been selected
 * by the player, including its position and properties.
 */
export class SelectedItemData implements ISelectedItemData {
    /** Event name for when an item is selected */
    public static readonly SELECTED_EVENT: string = 'game-item-selected';

    /** The position of the selected item in the grid */
    private _position: Vec2 = null;
    /** Reference to the actual game field item */
    private _item: GameFieldItem = null;
    
    /**
     * Gets the position of the selected item.
     */
    public get position(): Vec2 {
        return this._position;
    }

    /**
     * Sets the position of the selected item.
     */
    public set position(value: Vec2) {
        this._position = value;
    }

    /**
     * Gets the game field item reference.
     */
    public get item(): GameFieldItem {
        return this._item;
    }

    /**
     * Sets the game field item reference.
     */
    public set item(value: GameFieldItem) {
        this._item = value;
    }
}