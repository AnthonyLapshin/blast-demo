import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { GameContext } from "../GameContext";

export class GameOver extends BaseState<GameContext>{
    public static readonly STATE_NAME: string = 'GameOver';

    constructor() {
        super(GameOver.STATE_NAME);
    }

    public onEnter(context: GameContext): void {
        console.log(`[GameState] Entering ${GameOver.STATE_NAME}`);
        
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