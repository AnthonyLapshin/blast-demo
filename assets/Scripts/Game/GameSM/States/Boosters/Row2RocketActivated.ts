import { BaseState } from "../../../../Libs/StateMachine/BaseState";
import { GameContext } from "../../GameContext";

export class Row2RocketActivated extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'Row2RocketActivated';
    constructor() {
        super(Row2RocketActivated.STATE_NAME);
    }

    public async onEnter(context: GameContext): Promise<void> {
        console.log(`[GameState] Entering ${Row2RocketActivated.STATE_NAME}`);
    }
}   