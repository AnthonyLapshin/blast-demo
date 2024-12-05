import { BaseState } from "../../../../Libs/StateMachine/BaseState";
import { GameContext } from "../../GameContext";

export class Column2RocketActivated extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'Column2RocketActivated';
    constructor() {
        super(Column2RocketActivated.STATE_NAME);
    }

    public async onEnter(context: GameContext): Promise<void> {
        console.log(`[GameState] Entering ${Column2RocketActivated.STATE_NAME}`);
    }
}   