/**
 * @file GameRemoveCluster.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { GameContext } from "../GameContext";

/**
 * Represents the state where the game removes a cluster of items from the game field.
 * This state is entered after a valid cluster has been found and selected.
 */
export class GameRemoveCluster extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'GameRemoveCluster';

    constructor() {
        super(GameRemoveCluster.STATE_NAME);
    }

    /**
     * Handles entering the cluster removal state.
     * Removes the selected cluster of items from the game field and adds them to the appropriate pools.
     * @param context - The game context
     */
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