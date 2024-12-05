/**
 * @file GameSearchCluster.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-06
 */

import { inject } from "../../../Libs/Injects/inject";
import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { ClusterSeekerService } from "../../../Services/ClusterSeekerService";
import { IClusterSeekerService } from "../../../Services/Interfaces/IClusterSeekerService";
import { GameContext } from "../GameContext";

/**
 * Represents the state where the game searches for a cluster of matching items.
 * A cluster is a group of adjacent items of the same type that can be removed together.
 */
export class GameSearchCluster extends BaseState<GameContext>{
    public static readonly STATE_NAME: string = 'GameSearchCluster';
    private readonly _clusterSeeker: IClusterSeekerService =  inject(ClusterSeekerService);
    
    constructor() {
        super(GameSearchCluster.STATE_NAME);
    }

    /**
     * Handles entering the cluster search state.
     * Searches for a cluster of matching items around the selected item.
     * @param context - The game context
     */
    public async onEnter(context: GameContext): Promise<void> {
        const conf = context.gameConf;
        const item = context.selectedItem;
        const items = context.items;
        // If it's booster then we just need to set the cluster and return
        if (item.item.IsBooster){
            context.currentCluster = [item.item];
            return;
        }
        const cluster = this._clusterSeeker.CollectCluster(items, conf.minClusterSize, item.position.x, item.position.y, 'ItemType');

        if (cluster.length >= conf.minClusterSize) {
            context.currentCluster = cluster;
        }else{
            context.selectedItem = null;
        }
    }
}