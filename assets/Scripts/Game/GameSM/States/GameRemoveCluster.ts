import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { GameContext } from "../GameContext";

export class GameRemoveCluster extends BaseState<GameContext>{
    public static readonly STATE_NAME: string = 'GameRemoveCluster';

    constructor() {
        super(GameRemoveCluster.STATE_NAME);
    }

    public async onEnter(context: GameContext): Promise<void> {
        console.log(`[GameState] Entering ${GameRemoveCluster.STATE_NAME}`);
        
        const cluster = context.currentCluster;
        const items = context.items;
        const pool = context.itemsPool;

        for (const item of cluster) {
            const index = items.findIndex(row => row.indexOf(item) !== -1);
            if (index !== -1) {
                const columnIndex = items[index].indexOf(item);
                if (columnIndex !== -1) {
                    // Remove the item from the grid
                    items[index][columnIndex] = null;
                    // Remove the item from the scene and add to pool
                    item.node.removeFromParent();
                    pool.push(item);
                }
            }
        }
        //cleanup
        context.currentCluster = null;
    }
}