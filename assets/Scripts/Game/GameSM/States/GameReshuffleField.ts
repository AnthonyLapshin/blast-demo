import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { GameContext } from "../GameContext";

export class GameReshuffleField extends BaseState<GameContext>{
    public static readonly STATE_NAME: string = 'GameReshuffleField';

    constructor() {
        super(GameReshuffleField.STATE_NAME);
    }

    public async onEnter(context: GameContext): Promise<void> {
        console.log(`[GameState] Entering ${GameReshuffleField.STATE_NAME}`);
        context.isMovingItems = true;
        const items = context.items;
        const movingItems = [];
        const lvlConf = context.lvlConf;

        context.items.shuffle2D();
        
        for (let i = 0; i < lvlConf.width; i++) {
            for (let j = 0; j < lvlConf.height; j++) {
                var item = items[i][j];
                movingItems.push(item.moveToPosition(i * lvlConf.cellWidth, j * lvlConf.cellHeight, 0.5));
            }
        }
        // Wait for all movements to complete
        await Promise.all(movingItems);
        context.isMovingItems = false;
    }

    public onExit(context: GameContext): void {
        context.shuffleCounter++;
    }
}