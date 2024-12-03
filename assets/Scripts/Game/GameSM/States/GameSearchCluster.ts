import { inject } from "../../../Libs/Injects/inject";
import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { ClusterSeekerService } from "../../../Services/ClusterSeekerService";
import { IClusterSeekerService } from "../../../Services/IClusterSeekerService";
import { GameContext } from "../GameContext";

export class GameSearchCluster extends BaseState<GameContext>{
    public static readonly STATE_NAME: string = 'GameSearchCluster';
    private readonly _clusterSeeker: IClusterSeekerService =  inject(ClusterSeekerService);
    
    constructor() {
        super(GameSearchCluster.STATE_NAME);
    }

    public async onEnter(context: GameContext): Promise<void> {
        console.log(`[GameState] Entering ${GameSearchCluster.STATE_NAME}`);
        const conf = context.gameConf;
        const item = context.selectedItem;
        const items = context.items;

        const cluster = this._clusterSeeker.CollectCluster(items, conf.minClusterSize, item.position.x, item.position.y, 'ItemType');

        if (cluster.length >= conf.minClusterSize) {
            console.log('Found clusters:', cluster.length);
            context.currentCluster = cluster;
        }else{
            console.log('Clusters with minimum size not found. Currtent cluster length: ', cluster.length);
        }
        context.selectedItem = null;
    }
}