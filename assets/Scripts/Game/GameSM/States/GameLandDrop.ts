import { inject } from "../../../Libs/Injects/inject";
import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { FieldCoordinatesService } from "../../../Services/FieldCoordinatesService";
import { SelectedItemData } from "../../Base/SelectedItemData";
import { GameContext } from "../GameContext";

export class GameLandDrop extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'GameLandDrop'
    private readonly _coordinatesService: FieldCoordinatesService = inject(FieldCoordinatesService);
    
    constructor() {
        super(GameLandDrop.STATE_NAME);
    }
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