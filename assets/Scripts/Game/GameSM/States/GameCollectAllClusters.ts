/**
 * @file GameCollectAllClusters.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-06
 */

import { GameFieldItem } from "../../../GameField/GameFieldItem";
import { inject } from "../../../Libs/Injects/inject";
import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { ClusterSeekerService } from "../../../Services/ClusterSeekerService";
import { IClusterSeekerService } from "../../../Services/Interfaces/IClusterSeekerService";
import { GameContext } from "../GameContext";

/**
 * Represents the state where the game collects all possible clusters on the game field.
 * This state is used for special game modes or power-ups that affect multiple clusters at once.
 */
export class GameCollectAllClusters extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'GameCollectAllClusters'
    private readonly _clusterSeeker: IClusterSeekerService = inject(ClusterSeekerService);
    
    constructor() {
        super(GameCollectAllClusters.STATE_NAME);
    }

    /**
     * Handles entering the collect all clusters state.
     * Finds and collects all valid clusters on the game field.
     * @param context - The game context
     */
    public async onEnter(context: GameContext): Promise<void> {
        const conf = context.gameConf;
        const items = context.items;
        context.remainClusters = this._clusterSeeker.FindAllClusters(items, conf.minClusterSize, GameFieldItem.COMPONENT_NAME);
        if (context.remainClusters.length >0 ){
            context.shuffleCounter = 0;
        }
    }
}