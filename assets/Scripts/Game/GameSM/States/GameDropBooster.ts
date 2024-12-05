/**
 * @file GameDropBooster.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-06
 */

import { instantiate, Prefab } from "cc";
import { GameFieldItem } from "../../../GameField/GameFieldItem";
import { inject } from "../../../Libs/Injects/inject";
import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { ArrayUtils } from "../../../Libs/utils/ArrayUtils";
import { ILevelConfigurationService } from "../../../Services/Interfaces/ILevelConfiguration";
import { LevelConfigurationService } from "../../../Services/LevelConfiguration";
import { SelectedItemData } from "../../Base/SelectedItemData";
import { GameContext } from "../GameContext";
import { GameTool } from "../../EnumGameTool";

/**
 * Represents the state where the game drops a booster item onto the game field.
 * This state is entered when a cluster is cleared and meets the conditions for dropping a booster.
 */
export class GameDropBooster extends BaseState<GameContext>{
    public static readonly STATE_NAME: string = 'GameDropBooster';
    private _lvlConf: ILevelConfigurationService = inject(LevelConfigurationService);
    
    /**
     * Initializes the GameDropBooster state.
     */
    constructor() {
        super(GameDropBooster.STATE_NAME);
    }

    /**
     * Handles entering the booster drop state.
     * Determines if a booster should be dropped based on cluster size and configuration.
     * Creates and places the booster if conditions are met.
     * @param context - The game context
     */
    public async onEnter(context: GameContext): Promise<void> {
        if(context.selectedItem.item.IsBooster || context.currentTool != GameTool.SELECTOR) 
            return;
        
        const clusterLength = context.currentCluster.length;
        const drops = this._lvlConf.drops;
        let maxDropKey = 0;
        for (const key of Object.keys(drops)) {
            const numKey = parseInt(key);
            if (numKey <= clusterLength && numKey > maxDropKey) {
                maxDropKey = numKey;
            }
        }
       
        const drop = ArrayUtils.getRandomItem(drops[maxDropKey]); // Get a random item from the highest key drops[maxDropKey];
        if (drop == null) return;

        var dropItem:GameFieldItem = this.getCachedDrop(context, drop);
        
        if (dropItem == null) {
            for (let i = 0; i < context.dropPrefabs.length; i++) {
                let dropPrefab: Prefab = context.dropPrefabs[i];
                if (dropPrefab.name != drop){
                    continue;
                }
                dropItem = instantiate(dropPrefab).getComponent(GameFieldItem.COMPONENT_NAME) as GameFieldItem;
                dropItem.node.on(GameFieldItem.CLICKED_EVENT, (clickedItem: GameFieldItem) => {
                    context.onClickedItemCb(clickedItem);
                });
            }
        }

        var itemData = new SelectedItemData();
        itemData.position = context.selectedItem.position;
        itemData.item = dropItem;
        context.droppedItems.push(itemData);
    }

    /**
     * Attempts to get a cached booster item from the drops pool.
     * @param context - The game context
     * @param drop - The type of booster to retrieve
     * @returns The cached booster item if found, null otherwise
     */
    private getCachedDrop(context: GameContext, drop: string):GameFieldItem {
        for (let i = 0; i < context.dropsPool.length; i++) {
            if (context.dropsPool[i].ItemType == drop) {
                const item = context.dropsPool[i];
                context.dropsPool.splice(i, 1);
                return item;
            }
        }
        return null;
    }

    /**
     * Handles exiting the booster drop state.
     * Resets the selected item.
     * @param context - The game context
     */
    public async onExit(context: GameContext): Promise<void> {
        context.selectedItem = null;
    }
}