import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { GameContext } from "../GameContext";

export class GameRemoveCluster extends BaseState<GameContext>{
    public static readonly STATE_NAME: string = 'GameRemoveCluster';

    constructor() {
        super(GameRemoveCluster.STATE_NAME);
    }

    public async onEnter(context: GameContext): Promise<void> {
        const cluster = context.currentCluster;
        if (!cluster || cluster.length === 0) {
            return;
        }

        const items = context.items;
        const pool = context.itemsPool;
        const dropsPool = context.dropsPool;

        for (const item of cluster) {
            const index = items.findIndex(row => row.indexOf(item) !== -1);
            if (index !== -1) {
                const columnIndex = items[index].indexOf(item);
                if (columnIndex !== -1) {
                    // Remove the item from the grid
                    items[index][columnIndex] = null;
                    // Remove the item from the scene and add to pool
                    item.node.removeFromParent();
                    if (item.IsBooster) {
                        dropsPool.push(item);
                    }else{
                        pool.push(item);
                    }
                }
            }
        }
        //cleanup
        context.currentCluster = null;
    }
}