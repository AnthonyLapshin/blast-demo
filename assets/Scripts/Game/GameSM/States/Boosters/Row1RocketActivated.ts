import { BaseState } from "../../../../Libs/StateMachine/BaseState";
import { GameContext } from "../../GameContext";

export class Row1RocketActivated extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'Row1RocketActivated';
    constructor() {
        super(Row1RocketActivated.STATE_NAME);
    }
}   