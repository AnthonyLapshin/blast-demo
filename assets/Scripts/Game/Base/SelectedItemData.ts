import { Vec2 } from "cc";
import { ISelectedItemData } from "./ISelectedItemEvent";
import { GameFieldItem } from "../../GameField/GameFieldItem";

export class SelectedItemData implements ISelectedItemData {
    public static readonly SELECTED_EVENT: string = 'game-item-selected';
    private _position: Vec2 = null;
    private _item: GameFieldItem = null;
    
    public get item(): GameFieldItem {
        return this._item;
    }
    public set item(value: GameFieldItem) {
        this._item = value;
    }
    
    public get position(): Vec2 {
        return this._position;
    }

    public set position(value: Vec2) {
        this._position = value;
    }
}