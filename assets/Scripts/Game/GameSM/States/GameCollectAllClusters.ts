import { GameFieldItem } from "../../../GameField/GameFieldItem";
import { inject } from "../../../Libs/Injects/inject";
import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { ClusterSeekerService } from "../../../Services/ClusterSeekerService";
import { IClusterSeekerService } from "../../../Services/IClusterSeekerService";
import { GameContext } from "../GameContext";

export class GameCollectAllClusters extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'GameCollectAllClusters'
    private readonly _clusterSeeker: IClusterSeekerService = inject(ClusterSeekerService);
    
    constructor() {
        super(GameCollectAllClusters.STATE_NAME);
    }

    public async onEnter(context: GameContext): Promise<void> {
        console.log(`[GameState] Entering ${GameCollectAllClusters.STATE_NAME}`);
        const conf = context.gameConf;
        const items = context.items;
        context.remainClusters = this._clusterSeeker.FindAllClusters(items, conf.minClusterSize, GameFieldItem.COMPONENT_NAME);
        if (context.remainClusters.length >0 ){
            context.shuffleCounter = 0;
        }
        console.log(`[GameState] Remains clusters: ${context.remainClusters.length}`);
    }
}