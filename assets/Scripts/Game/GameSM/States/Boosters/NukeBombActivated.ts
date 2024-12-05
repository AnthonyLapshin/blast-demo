/**
 * @file NukeBombActivated.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

import { GameFieldItem } from "../../../../GameField/GameFieldItem";
import { BaseState } from "../../../../Libs/StateMachine/BaseState";
import { GameContext } from "../../GameContext";

/**
 * Represents the state when a nuke bomb booster is activated.
 * This booster is the most powerful, clearing all items from the game field
 * in a single explosion. It provides a strategic option for players to completely
 * reset the field when they are in a difficult situation.
 */
export class NukeBombActivated extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'NukeBombActivated';

    constructor() {
        super(NukeBombActivated.STATE_NAME);
    }

    /**
     * Handles entering the nuke bomb activation state.
     * Collects all items on the field for removal, triggering a complete field clear.
     * @param context - The game context containing the current game state and field data
     */
    public async onEnter(context: GameContext): Promise<void> {
        const items = context.items;
        const cluster: GameFieldItem[] = [];

        for (let i = 0; i < items.length; i++) {
            for (let j = 0; j < items[i].length; j++) {
                cluster.push(items[i][j]);
            }
        }
        context.currentCluster = cluster;
    }
}