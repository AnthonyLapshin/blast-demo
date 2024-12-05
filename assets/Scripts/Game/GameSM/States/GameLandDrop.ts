/**
 * @file GameLandDrop.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

import { inject } from "../../../Libs/Injects/inject";
import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { FieldCoordinatesService } from "../../../Services/FieldCoordinatesService";
import { SelectedItemData } from "../../Base/SelectedItemData";
import { GameContext } from "../GameContext";

/**
 * Represents the state where dropped items land on the game field.
 * This state handles the placement of dropped items (like boosters or special items)
 * into their final positions on the game field.
 */
export class GameLandDrop extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'GameLandDrop'
    private readonly _coordinatesService: FieldCoordinatesService = inject(FieldCoordinatesService);
    
    constructor() {
        super(GameLandDrop.STATE_NAME);
    }

    /**
     * Handles entering the land drop state.
     * Places dropped items into their designated positions on the field.
     * @param context - The game context
     */
    public async onEnter(context: GameContext): Promise<void> {        
        for (let i = 0; i < context.droppedItems.length; i++) {
            this.replaceItem(context, context.droppedItems[i]);
        }
        context.droppedItems = [];
    }

    private replaceItem(context: GameContext, itemData: SelectedItemData): void {
        var currentItem = context.items[itemData.position.x][itemData.position.y];
        currentItem.node.removeFromParent();
        context.itemsPool.push(currentItem);

        context.items[itemData.position.x][itemData.position.y] = itemData.item;

        var cords = this._coordinatesService.fieldToWorldCoordsinates(itemData.position.x, itemData.position.y);
        itemData.item.node.setPosition(cords.x, cords.y);
        context.gameNode.addChild(itemData.item.node);
    }
}   