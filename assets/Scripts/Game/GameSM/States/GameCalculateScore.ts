import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { GameTool } from "../../EnumGameTool";
import { GameContext } from "../GameContext";

export class GameCalculateScore extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'GameCalculateScore'
    
    constructor() {
        super(GameCalculateScore.STATE_NAME);
    }

    public async onEnter(context: GameContext): Promise<void> {
        console.log(`[GameState] Entering ${GameCalculateScore.STATE_NAME}`);
        context.gameMoves ++;
        if (context.currentTool == GameTool.SELECTOR){ 
            const itemType: string = context.currentCluster[0].ItemType
            const payOut:number = context.lvlConf.paytable[itemType]
            context.gameScore += payOut * context.currentCluster.length;
        }else{
            for (let i = 0; i < context.currentCluster.length; i++) {
                context.gameScore += context.lvlConf.paytable[context.currentCluster[i].ItemType];
            }
        }
        console.log(`[GameState] Game moves: ${context.gameMoves}`);
        console.log(`[GameState] Points: ${context.gameScore}`);
    }

    public async onExit(context: GameContext): Promise<void> {
        context.currentTool = GameTool.SELECTOR;
    }
}