import { instantiate, Prefab } from "cc";
import { GameFieldItem } from "../../../GameField/GameFieldItem";
import { inject } from "../../../Libs/Injects/inject";
import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { ArrayUtils } from "../../../Libs/utils/ArrayUtils";
import { ILevelConfigurationService } from "../../../Services/ILevelConfiguration";
import { LevelConfigurationService } from "../../../Services/LevelConfiguration";
import { SelectedItemData } from "../../Base/SelectedItemData";
import { GameContext } from "../GameContext";

export class GameDropBooster extends BaseState<GameContext>{
    public static readonly STATE_NAME: string = 'GameDropBooster';
    private _lvlConf: ILevelConfigurationService = inject(LevelConfigurationService);
    
    constructor() {
        super(GameDropBooster.STATE_NAME);
    }

    public async onEnter(context: GameContext): Promise<void> {
        
        console.log(`[GameState] Entering ${GameDropBooster.STATE_NAME}`);
        if(context.selectedItem.item.IsBooster) return;
        
        const clusterLength = context.currentCluster.length;
        console.log(`--> [GameState] Cluster length: ${clusterLength}`);
        const drops = this._lvlConf.drops;
        let maxDropKey = 0;
        for (const key of Object.keys(drops)) {
            const numKey = parseInt(key);
            console.log(`--> [GameState] Drop key: ${numKey}`);
            if (numKey <= clusterLength && numKey > maxDropKey) {
                maxDropKey = numKey;
                console.log(`--> [GameState] Max drop key: ${maxDropKey}`);
            }
        }
       
        const drop = ArrayUtils.getRandomItem(drops[maxDropKey]); // Get a random item from the highest key drops[maxDropKey];
        if (drop == null) return;

        console.log(`!!--> [GameState] Selected drop: ${drop}`);
        var dropItem:GameFieldItem = this.getCachedDrop(context, drop);
        console.log(`!!--> [GameState] Cached drop item: ${dropItem}`);
        
    
        if (dropItem == null) {
            for (let i = 0; i < context.dropPrefabs.length; i++) {
                let dropPrefab: Prefab = context.dropPrefabs[i];
                console.log(`!!--> [GameState] Drop prefab: ${dropPrefab.name}`);
                if (dropPrefab.name != drop){
                    continue;
                }
                dropItem = instantiate(dropPrefab).getComponent(GameFieldItem.COMPONENT_NAME) as GameFieldItem;
                console.log(`!!--> [GameState] Instantiated drop item: ${dropItem.name}`);
            }
        }

        
        var itemData = new SelectedItemData();
        console.log(`>!!--> [GameState] Selected item : ${context.selectedItem}`);
        itemData.position = context.selectedItem.position;
        console.log(`!!--> [GameState] Selected item position: ${itemData.position.x}, ${itemData.position.y}`);
        itemData.item = dropItem;
        console.log(`!!--> [GameState] Selected item: ${itemData.item.name}`);
        context.droppedItems.push(itemData);

        console.log(`!!--> [GameState] Dropped items count: ${context.droppedItems.length}!`);
        
    }

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

    public async onExit(context: GameContext): Promise<void> {
        context.selectedItem = null;
    }
}