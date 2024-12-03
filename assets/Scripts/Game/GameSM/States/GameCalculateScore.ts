import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { GameContext } from "../GameContext";

export class GameCalculateScore extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'GameCalculateScore'
    
    constructor() {
        super(GameCalculateScore.STATE_NAME);
    }

    public async onEnter(context: GameContext): Promise<void> {
        console.log(`[GameState] Entering ${GameCalculateScore.STATE_NAME}`);
        context.gameMoves ++;

        const itemType: string = context.currentCluster[0].ItemType
        const payOut:number = context.lvlConf.paytable[itemType]
        context.gameScore += payOut * context.currentCluster.length;

        console.log(`[GameState] Game moves: ${context.gameMoves}`);
        console.log(`[GameState] Points: ${context.gameScore}`);
    }
}