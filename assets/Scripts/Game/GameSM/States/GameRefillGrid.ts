import { GameFieldItem } from "../../../GameField/GameFieldItem";
import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { ArrayUtils } from "../../../Libs/utils/ArrayUtils";
import { GameContext } from "../GameContext";

export class GameRefillGrid extends BaseState<GameContext>{
    public static readonly STATE_NAME: string = 'GameRefillGrid'

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
                    item.node.setPosition(i * lvlConf.cellWidth, (lvlConf.height + 1) * lvlConf.cellHeight);
                    rootNode.addChild(item.node);
                     // Track the movement
                     movingItems.push(item.moveToPosition(i * lvlConf.cellWidth, j * lvlConf.cellHeight, 0.2, (lvlConf.height - j) * 0.15));
                }
            }
        }
        // Wait for all movements to complete
        await Promise.all(movingItems);
        context.isMovingItems = false;
    }
}