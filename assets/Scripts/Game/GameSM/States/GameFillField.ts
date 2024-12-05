/**
 * @file GameFillField.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-06
 */

import { instantiate, Prefab } from "cc";
import { GameFieldItem } from "../../../GameField/GameFieldItem";
import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { ArrayUtils } from "../../../Libs/utils/ArrayUtils";
import { GameContext } from "../GameContext";
import { inject } from "../../../Libs/Injects/inject";
import { IClusterSeekerService } from "../../../Services/Interfaces/IClusterSeekerService";
import { ClusterSeekerService } from "../../../Services/ClusterSeekerService";
import { FieldCoordinatesService } from "../../../Services/FieldCoordinatesService";
import { ILevelConfigurationService } from "../../../Services/Interfaces/ILevelConfiguration";
import { LevelConfigurationService } from "../../../Services/LevelConfiguration";

/**
 * Represents the state where the game fills the field with new items.
 * This state is responsible for initializing the game field at the start
 * and refilling empty spaces with new items.
 */
export class GameFillField extends BaseState<GameContext>{

    public static readonly STATE_NAME: string = 'GameFillField';
    private readonly _clusterSeeker: IClusterSeekerService =  inject(ClusterSeekerService);
    private readonly _coordinatesService: FieldCoordinatesService = inject(FieldCoordinatesService);
    private readonly _lvlConf: ILevelConfigurationService = inject(LevelConfigurationService);
    
    constructor() {
        super(GameFillField.STATE_NAME);
    }

    /**
     * Handles entering the field fill state.
     * Creates and places new items in empty spaces on the game field.
     * @param context - The game context
     */
    public async onEnter(context: GameContext): Promise<void> {
        const gameConf = context.gameConf;
        const lvlConf = context.lvlConf;
        const rootNode = context.gameNode;
        context.gameScore = gameConf.startPointsAmount;
        const items = context.items;

        for (let i = 0; i < lvlConf.width; i++) {
            context.items[i] = [];
            for (let j = 0; j < lvlConf.height; j++) {                
                var poolItem = this.createItem(context);
                context.itemsPool.push(poolItem);
                const item = this.createItem(context);
                var cords = this._coordinatesService.fieldToWorldCoordsinates(i, j);
                item.node.setPosition(cords.x, cords.y);
                rootNode.addChild(item.node);

                items[i][j] = item;
            }
        }

        //add boosters
        for (let i = 0; i < context.dropPrefabs.length; i++) {
            const item = instantiate(context.dropPrefabs[i]);
            var itemComponent = item.getComponent(GameFieldItem.COMPONENT_NAME) as GameFieldItem;
            item.on(GameFieldItem.CLICKED_EVENT, (clickedItem: GameFieldItem) => {
                context.onClickedItemCb(clickedItem);
            });
            context.dropsPool.push(itemComponent);
        }
        
        ///reshiffle in the beginning
        context.remainClusters = this._clusterSeeker.FindAllClusters(items, gameConf.minClusterSize, GameFieldItem.COMPONENT_NAME);
        const initialreshuffle = context.remainClusters.length == 0;
        if (initialreshuffle) {
            while(context.remainClusters.length == 0 && context.shuffleCounter <= gameConf.reshuffles){
                context.shuffleCounter++;
                context.remainClusters = this._clusterSeeker.FindAllClusters(items, gameConf.minClusterSize, GameFieldItem.COMPONENT_NAME);
            }

            for (let i = 0; i < lvlConf.width; i++) {
                context.items[i] = [];
                for (let j = 0; j < lvlConf.height; j++) {                
                    var item = items[i][j];
                    var cords = this._coordinatesService.fieldToWorldCoordsinates(i, j);
                    item.node.setPosition(cords.x, cords.y);
                }
            }  
        }
    }


    /**
     * Creates a new game item.
     * @param context - The game context
     * @param subscribeClickEvents - Whether to subscribe to click events
     * @returns The created game item
     */
    private createItem(context: GameContext, subscribeClickEvents: boolean = true):GameFieldItem{
        const item = instantiate((ArrayUtils.getRandomItem(context.itemPrefabs)));
        var itemComponent = item.getComponent(GameFieldItem.COMPONENT_NAME) as GameFieldItem;
        if(subscribeClickEvents){
            item.on(GameFieldItem.CLICKED_EVENT, (clickedItem: GameFieldItem) => {
                context.onClickedItemCb(clickedItem);
            });
        }
        return itemComponent;
    }

}