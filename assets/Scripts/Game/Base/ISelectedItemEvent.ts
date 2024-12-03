import { Vec2 } from "cc";
import { GameFieldItem } from "../../GameField/GameFieldItem";

export interface ISelectedItemData {
    get position(): Vec2;
    set position(value: Vec2);

    get item(): GameFieldItem;
    set item(value: GameFieldItem);
}