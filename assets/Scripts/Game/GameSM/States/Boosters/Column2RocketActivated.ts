/**
 * @file Column2RocketActivated.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

import { GameFieldItem } from "../../../../GameField/GameFieldItem";
import { BaseState } from "../../../../Libs/StateMachine/BaseState";
import { GameContext } from "../../GameContext";

/**
 * Represents the state when a double-column rocket booster is activated.
 * This booster clears all items in two adjacent columns of the game field.
 */
export class Column2RocketActivated extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'Column2RocketActivated';

    constructor() {
        super(Column2RocketActivated.STATE_NAME);
    }

    /**
     * Handles entering the double-column rocket activation state.
     * Collects all items in the selected column and an adjacent column for removal.
     * @param context - The game context
     */
    public async onEnter(context: GameContext): Promise<void> {
        const items = context.items;
        const cluster: GameFieldItem[] = [];
        
        const selectedColumn = context.selectedItem.position.x;
        for (let j = 0; j < items[0].length; j++) {
            for (let i = Math.max(0, selectedColumn - 1); i <= Math.min(selectedColumn + 1, items.length - 1); i++) {
                if (items[i][j]) {
                    cluster.push(items[i][j]);
                }
            }
        }
        context.currentCluster = cluster;
    }
}   