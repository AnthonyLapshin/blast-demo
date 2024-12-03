import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { GameContext } from "../GameContext";

export class GameCollapseField extends BaseState<GameContext>{
    public static readonly STATE_NAME: string = 'GameCollapseField';
    
    constructor() {
        super(GameCollapseField.STATE_NAME);
    }

    public async onEnter(context: GameContext): Promise<void> {
        console.log(`[GameState] Entering ${GameCollapseField.STATE_NAME}`);
        const items = context.items;
        const height = items[0].length;
        const conf = context.lvlConf;
        const movingItems = [];

        // Process each column independently
        for (let col = 0; col < items.length; col++) {
            // Start checking from bottom
            for (let row = 0; row < height; row++) {
                if (!items[col][row]) {
                    // Found an empty spot, look above for items to fall
                    for (let above = row + 1; above < height; above++) {
                        var item = items[col][above];
                        if (item) {
                             // Track the movement
                             movingItems.push(item.moveToPosition(col * conf.cellWidth, row * conf.cellHeight, 0.2, (above - row) * 0.1));
                            // Update grid references
                            items[col][row] = items[col][above];
                            items[col][above] = null;
                            break;
                        }
                    }
                }
            }
        }       
         // Wait for all movements to complete
        await Promise.all(movingItems);
        context.isMovingItems = false;
    }
}