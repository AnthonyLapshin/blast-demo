/**
 * @file GameOver.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { GameContext } from "../GameContext";

/**
 * Represents the final state when the game is over.
 * This state is entered when the player has either won or lost the game,
 * typically when they've run out of moves or reached the target score.
 */
export class GameOver extends BaseState<GameContext>{
    public static readonly STATE_NAME: string = 'GameOver';

    constructor() {
        super(GameOver.STATE_NAME);
    }

    /**
     * Handles entering the game over state.
     * Performs final game cleanup and triggers the game over UI.
     * @param context - The game context
     */
    public async onEnter(context: GameContext): Promise<void> {
        // Clean up the game field
        const items = context.items;
        for (let i = 0; i < items.length; i++) {
            for (let j = 0; j < items[i].length; j++) {
                if (items[i][j]) {
                    items[i][j].node.removeFromParent();
                    context.itemsPool.push(items[i][j]);
                    items[i][j] = null;
                }
            }
        }

        // Trigger game over UI or any other necessary actions
        context.gameNode.emit('game-over');
    }
}