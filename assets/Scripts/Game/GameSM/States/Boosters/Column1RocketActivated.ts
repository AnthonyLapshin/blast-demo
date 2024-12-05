/**
 * @file Column1RocketActivated.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

import { GameFieldItem } from "../../../../GameField/GameFieldItem";
import { BaseState } from "../../../../Libs/StateMachine/BaseState";
import { GameContext } from "../../GameContext";

/**
 * Represents the state when a single-column rocket booster is activated.
 * This booster clears all items in a single column of the game field.
 */
export class Column1RocketActivated extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'Column1RocketActivated';

    constructor() {
        super(Column1RocketActivated.STATE_NAME);
    }

    /**
     * Handles entering the column rocket activation state.
     * Collects all items in the selected column for removal.
     * @param context - The game context
     */
    public async onEnter(context: GameContext): Promise<void> {
        const items = context.items;
        const cluster: GameFieldItem[] = [];
        
        const selectedColumn = context.selectedItem.position.x;
        for (let j = 0; j < items[0].length; j++) {
            if (items[selectedColumn][j]) {
                cluster.push(items[selectedColumn][j]);
            }
        }
        
        context.currentCluster = cluster;
    }
}   