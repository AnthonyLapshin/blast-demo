import { inject } from "../../../Libs/Injects/inject";
import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { FieldCoordinatesService } from "../../../Services/FieldCoordinatesService";
import { GameContext } from "../GameContext";

export class GameCollapseField extends BaseState<GameContext>{
    public static readonly STATE_NAME: string = 'GameCollapseField';
    private readonly _coordinatesService: FieldCoordinatesService = inject(FieldCoordinatesService);
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
        for (let i = 0; i < items.length; i++) {
            // Start checking from bottom
            for (let j = 0; j < height; j++) {
                if (!items[i][j]) {
                    // Found an empty spot, look above for items to fall
                    for (let above = j + 1; above < height; above++) {
                        var item = items[i][above];
                        if (item) {

                             // Track the movement
                             var cords = this._coordinatesService.fieldToWorldCoordsinates(i, j);

                             movingItems.push(item.moveToPosition(cords.x, cords.y, 0.07, i * 0.04));
                            // Update grid references
                            items[i][j] = items[i][above];
                            items[i][above] = null;
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