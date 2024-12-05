/**
 * @file GameReshuffleField.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

import { inject } from "../../../Libs/Injects/inject";
import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { FieldCoordinatesService } from "../../../Services/FieldCoordinatesService";
import { GameContext } from "../GameContext";

/**
 * Represents the state where the game reshuffles all items on the field.
 * This state is entered when there are no valid moves available,
 * ensuring the game remains playable by randomizing item positions.
 */
export class GameReshuffleField extends BaseState<GameContext>{
    public static readonly STATE_NAME: string = 'GameReshuffleField';
    private readonly _coordinatesService: FieldCoordinatesService = inject(FieldCoordinatesService);
    /**
     * Initializes a new instance of the GameReshuffleField state.
     */
    constructor() {
        super(GameReshuffleField.STATE_NAME);
    }

    /**
     * Handles entering the field reshuffle state.
     * Randomly redistributes all items on the game field.
     * @param context - The game context
     */
    public async onEnter(context: GameContext): Promise<void> {
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

    /**
     * Handles exiting the field reshuffle state.
     * Increments the shuffle counter.
     * @param context - The game context
     */
    public async onExit(context: GameContext): Promise<void> {
        context.shuffleCounter++;
    }
}