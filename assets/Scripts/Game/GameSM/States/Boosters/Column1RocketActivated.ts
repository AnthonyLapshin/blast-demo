import { BaseState } from "../../../../Libs/StateMachine/BaseState";
import { GameContext } from "../../GameContext";

export class Column1RocketActivated extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'Column1RocketActivated';
    constructor() {
        super(Column1RocketActivated.STATE_NAME);
    }

    public async onEnter(context: GameContext): Promise<void> {
        console.log(`[GameState] Entering ${Column1RocketActivated.STATE_NAME}`);
        
    }
}   