import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { GameContext } from "../GameContext";

export class GameCalculateScore extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'GameCalculateScore'
    
    constructor() {
        super(GameCalculateScore.STATE_NAME);
    }

    public async onEnter(context: GameContext): Promise<void> {
        context.gameMoves ++;
        for (let i = 0; i < context.currentCluster.length; i++) {
            context.gameScore += context.lvlConf.paytable[context.currentCluster[i].ItemType];
        }
    }
}