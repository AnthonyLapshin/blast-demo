/**
 * @file Row2RocketActivated.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

import { GameFieldItem } from "../../../../GameField/GameFieldItem";
import { BaseState } from "../../../../Libs/StateMachine/BaseState";
import { GameContext } from "../../GameContext";

/**
 * Represents the state when a double-row rocket booster is activated.
 * This booster clears all items in two adjacent rows of the game field.
 */
export class Row2RocketActivated extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'Row2RocketActivated';

    constructor() {
        super(Row2RocketActivated.STATE_NAME);
    }

    /**
     * Handles entering the double-row rocket activation state.
     * Collects all items in the selected row and an adjacent row for removal.
     * @param context - The game context
     */
    public async onEnter(context: GameContext): Promise<void> {
        const items = context.items;
        const cluster: GameFieldItem[] = [];

        const selectedRow = context.selectedItem.position.y;
        
        for (let i = 0; i < items.length; i++) {
            for (let j = Math.max(0, selectedRow - 1); j <= Math.min(selectedRow + 1, items[i].length - 1); j++) {
                if (items[i][j]) {
                    cluster.push(items[i][j]);
                }
            }
        }

        context.currentCluster = cluster;
    }
}   