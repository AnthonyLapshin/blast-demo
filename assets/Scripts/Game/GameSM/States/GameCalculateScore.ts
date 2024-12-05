/**
 * @file GameCalculateScore.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { GameContext } from "../GameContext";

/**
 * Represents the state where the game calculates the score for removed items.
 * This state is entered after items have been removed from the game field.
 */
export class GameCalculateScore extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'GameCalculateScore';
    
    constructor() {
        super(GameCalculateScore.STATE_NAME);
    }

    /**
     * Handles entering the score calculation state.
     * Increments the game moves counter and calculates score based on removed items.
     * @param context - The game context
     */
    public async onEnter(context: GameContext): Promise<void> {
        context.gameMoves++;
        for (let i = 0; i < context.currentCluster.length; i++) {
            context.gameScore += context.lvlConf.paytable[context.currentCluster[i].ItemType];
        }
    }
}