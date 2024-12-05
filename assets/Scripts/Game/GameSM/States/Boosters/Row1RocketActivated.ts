/**
 * @file Row1RocketActivated.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

import { GameFieldItem } from "../../../../GameField/GameFieldItem";
import { BaseState } from "../../../../Libs/StateMachine/BaseState";
import { GameContext } from "../../GameContext";

/**
 * Represents the state when a single-row rocket booster is activated.
 * This booster clears all items in a single row of the game field.
 */
export class Row1RocketActivated extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'Row1RocketActivated';

    constructor() {
        super(Row1RocketActivated.STATE_NAME);
    }

    /**
     * Handles entering the row rocket activation state.
     * Collects all items in the selected row for removal.
     * @param context - The game context
     */
    public async onEnter(context: GameContext): Promise<void> {
        const items = context.items;
        const cluster: GameFieldItem[] = [];
        
        const selectedRow = context.selectedItem.position.y;
        for (let i = 0; i < items.length; i++) {
            if (items[i][selectedRow]) {
                cluster.push(items[i][selectedRow]);
            }
        }
        
        context.currentCluster = cluster;
    }
}   