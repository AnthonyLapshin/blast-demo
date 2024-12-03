import { inject } from "../../../Libs/Injects/inject";
import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { FieldCoordinatesService } from "../../../Services/FieldCoordinatesService";
import { GameContext } from "../GameContext";

export class GameReshuffleField extends BaseState<GameContext>{
    public static readonly STATE_NAME: string = 'GameReshuffleField';
    private readonly _coordinatesService: FieldCoordinatesService = inject(FieldCoordinatesService);
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
                var cords = this._coordinatesService.fieldToWorldCoordsinates(i, j);
                movingItems.push(item.moveToPosition(cords.x, cords.y, 1));
            }
        }
        // Wait for all movements to complete
        await Promise.all(movingItems);
        context.isMovingItems = false;
    }

    public async onExit(context: GameContext): Promise<void> {
        context.shuffleCounter++;
    }
}