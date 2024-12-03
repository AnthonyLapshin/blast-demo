import { GameFieldItem } from "../../../GameField/GameFieldItem";
import { inject } from "../../../Libs/Injects/inject";
import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { ArrayUtils } from "../../../Libs/utils/ArrayUtils";
import { FieldCoordinatesService } from "../../../Services/FieldCoordinatesService";
import { GameContext } from "../GameContext";

export class GameRefillGrid extends BaseState<GameContext>{
    public static readonly STATE_NAME: string = 'GameRefillGrid'

    private readonly _coordinatesService: FieldCoordinatesService = inject(FieldCoordinatesService);

    constructor() {
        super(GameRefillGrid.STATE_NAME);
    }

    public async onEnter(context: GameContext): Promise<void> {
        console.log(`[GameState] Entering ${GameRefillGrid.STATE_NAME}`);
        
        const items = context.items;
        const itemPool = context.itemsPool;
        const lvlConf = context.lvlConf;
        const rootNode = context.gameNode;
        const movingItems = [];
        context.isMovingItems = true;

        for (let i = 0; i < lvlConf.width; i++) {
            for (let j = 0; j < lvlConf.height; j++) {
                if (!items[i][j]) {
                    const item = ArrayUtils.getRandomItem(itemPool) as GameFieldItem;
                    ArrayUtils.removeItem(itemPool, item);
                    items[i][j] = item;
                    // add item on top of the grid (it will be behind the mask)
                    var cords = this._coordinatesService.fieldToWorldCoordsinates(i, j);
                    var spawnCords =  this._coordinatesService.fieldSpawnToWorldCoordsinates(i, j);
                    item.node.setPosition(spawnCords.x, spawnCords.y);

                    rootNode.addChild(item.node);
                     // Track the movement
                     movingItems.push(item.moveToPosition(cords.x, cords.y, 0.1, i * 0.08));
                }
            }
        }
        // Wait for all movements to complete
        await Promise.all(movingItems);
        context.isMovingItems = false;
    }
}