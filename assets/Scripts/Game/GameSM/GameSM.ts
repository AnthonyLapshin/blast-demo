import { singleton } from "../../Libs/Injects/decorators/singleton";
import { inject } from "../../Libs/Injects/inject";
import { FiniteStateMachine } from "../../Libs/StateMachine/FiniteStateMachine";
import { GameContext } from "./GameContext";
import { GameFillField } from "./States/GameFillField";
import { GameIdle } from "./States/GameIdle";
import { GameFieldItem } from "../../GameField/GameFieldItem";
import { SelectedItemData } from "../Base/SelectedItemData";
import { GameSearchCluster } from "./States/GameSearchCluster";
import { Vec2, Node, UITransform, Prefab } from "cc";
import { GameRemoveCluster } from "./States/GameRemoveCluster";
import { GameCollapseField } from "./States/GameCollapseField";
import { GameRefillGrid } from "./States/GameRefillGrid";
import { GameCollectAllClusters } from "./States/GameCollectAllClusters";
import { GameReshuffleField } from "./States/GameReshuffleField";
import { GameOver } from "./States/GameOver";
import { GameCalculateScore } from "./States/GameCalculateScore";
import { GameTool } from "../EnumGameTool";
import { GameBombActivation } from "./States/GameBombActivation";
import { GameDropBooster } from "./States/GameDropBooster";
import { GameLandDrop } from "./States/GameLandDrop";
import { NukeBombActivated } from "./States/Boosters/NukeBombActivated";
import { Column1RocketActivated } from "./States/Boosters/Column1RocketActivated";
import { Column2RocketActivated } from "./States/Boosters/Column2RocketActivated";
import { Row1RocketActivated } from "./States/Boosters/Row1RocketActivated";
import { Row2RocketActivated } from "./States/Boosters/Row2RocketActivated";

@singleton()
export class GameStateMachine extends FiniteStateMachine<GameContext> 
{   
    constructor() {
        const context: GameContext = inject(GameContext);    
        super(context);
    }

    public setItems(items: Prefab[]): void {
        if(this.context.itemPrefabs != null){
            throw new Error('Items already set');
        }
        this.context.itemPrefabs = items;
    }

    public setDrops(items: Prefab[]): void {
        if(this.context.dropPrefabs != null){
            throw new Error('Drops already set');
        }
        this.context.dropPrefabs = items;
    }

    private async setupStates() : Promise<void> {
        this.addState(new GameFillField());
        this.addState(new GameIdle());
        this.addState(new GameSearchCluster());
        this.addState(new GameRemoveCluster());
        this.addState(new GameCollapseField());
        this.addState(new GameRefillGrid());
        this.addState(new GameCollectAllClusters());
        this.addState(new GameReshuffleField());
        this.addState(new GameOver());
        this.addState(new GameCalculateScore());
        this.addState(new GameBombActivation());
        this.addState(new GameDropBooster());
        this.addState(new GameLandDrop());
        this.addState(new NukeBombActivated());
        this.addState(new Column1RocketActivated());
        this.addState(new Column2RocketActivated());
        this.addState(new Row1RocketActivated());
        this.addState(new Row2RocketActivated());        
    }
    
    // init -> IDLE
    private async setupTransitions() : Promise<void> {
        this.addTransition({
            from: GameFillField.STATE_NAME,
            to: GameIdle.STATE_NAME,
            guardCondition: (context) => {
                return context.needReshuffle == false 
                &&context.items.length > 0 
                && context.itemsPool.length >0 
                && context.gameNode != null;
            },
        });

        // init -> Game Over
        this.addTransition({
            from: GameFillField.STATE_NAME,
            to: GameOver.STATE_NAME,
            guardCondition: (context) => {
                return context.needReshuffle == true 
                && context.canReshuffle == false;
            },
        });
        
        // IDLE -> Search for cluster
        this.addTransition({
            from: GameIdle.STATE_NAME,
            to: GameSearchCluster.STATE_NAME,
            guardCondition: (context) => {
                return context.selectedItem != null
                && context.currentTool == GameTool.SELECTOR
                && !context.selectedItem.item.IsBooster;
            },
        });

        // IDLE -> Bomb
        this.addTransition({
            from: GameIdle.STATE_NAME,
            to: GameBombActivation.STATE_NAME,
            guardCondition: (context) => {
                return context.selectedItem != null
                && (context.currentTool == GameTool.BOMB_1 
                || context.currentTool == GameTool.BOMB_2);
            },
        });

        // IDLE -> Nuke Bomb
        this.addTransition({
            from: GameIdle.STATE_NAME,
            to: NukeBombActivated.STATE_NAME,
            guardCondition: (context) => {
                return context.selectedItem != null
                && context.currentTool == GameTool.SELECTOR
                && context.selectedItem.item.ItemType == GameTool.NUKE_BOMB;
            },
        });

        // Bomb -> Calculation
        this.addTransition({
            from: NukeBombActivated.STATE_NAME,
            to: GameCalculateScore.STATE_NAME
        });


        // IDLE -> Row Rocket 1
        this.addTransition({
            from: GameIdle.STATE_NAME,
            to: Row1RocketActivated.STATE_NAME,
            guardCondition: (context) => {
                return context.selectedItem != null
                && context.currentTool == GameTool.SELECTOR
                && context.selectedItem.item.ItemType == GameTool.ROW_ROCKET_1;
            },
        });

        // IDLE -> Row Rocket 2
        this.addTransition({
            from: GameIdle.STATE_NAME,
            to: Row2RocketActivated.STATE_NAME,
            guardCondition: (context) => {
                return context.selectedItem != null
                && context.currentTool == GameTool.SELECTOR
                && context.selectedItem.item.ItemType == GameTool.ROW_ROCKET_2;
            },
        });

        // IDLE -> Column Rocket 1
        this.addTransition({
            from: GameIdle.STATE_NAME,
            to: Column1RocketActivated.STATE_NAME,
            guardCondition: (context) => {
                return context.selectedItem != null
                && context.currentTool == GameTool.SELECTOR
                && context.selectedItem.item.ItemType == GameTool.COL_ROCKET_1;
            },
        });

        // IDLE -> Column Rocket 2
        this.addTransition({
            from: GameIdle.STATE_NAME,
            to: Column2RocketActivated.STATE_NAME,
            guardCondition: (context) => {
                return context.selectedItem != null
                && context.currentTool == GameTool.SELECTOR
                && context.selectedItem.item.ItemType == GameTool.COL_ROCKET_2;
            },
        });

        // Row Rocket 1 -> Calculation
        this.addTransition({
            from: Row1RocketActivated.STATE_NAME,
            to: GameCalculateScore.STATE_NAME
        });

        // Row Rocket 2 -> Calculation
        this.addTransition({
            from: Row2RocketActivated.STATE_NAME,
            to: GameCalculateScore.STATE_NAME
        });

        // Column Rocket 1 -> Calculation
        this.addTransition({
            from: Column1RocketActivated.STATE_NAME,
            to: GameCalculateScore.STATE_NAME
        });

        // Column Rocket 2 -> Calculation
        this.addTransition({
            from: Column2RocketActivated.STATE_NAME,
            to: GameCalculateScore.STATE_NAME
        });


        // Bomb -> Calculation
        this.addTransition({
            from: GameBombActivation.STATE_NAME,
            to: GameCalculateScore.STATE_NAME
        });

        // IDLE -> Search for cluster
        this.addTransition({
            from: GameIdle.STATE_NAME,
            to: GameOver.STATE_NAME,
            guardCondition: (context) => {
                return context.outOfMoves || context.pointTargetReached;
            },
        });

        // Search for cluster -> IDLE
        this.addTransition({
            from: GameSearchCluster.STATE_NAME,
            to: GameIdle.STATE_NAME,
            guardCondition: (context) => {
                return context.currentCluster == null;
            },
        });

        // Search for cluster -> Calculate score
        this.addTransition({
            from: GameSearchCluster.STATE_NAME,
            to: GameCalculateScore.STATE_NAME,
            guardCondition: (context) => {
                return context.currentCluster != null;
            },
        });

        // Calculate score -> Remove cluster
        this.addTransition({
            from: GameCalculateScore.STATE_NAME,
            to: GameDropBooster.STATE_NAME
        });

        // Calculate score -> Remove cluster
        this.addTransition({
            from: GameDropBooster.STATE_NAME,
            to: GameRemoveCluster.STATE_NAME
        });        

        // Remove cluster -> Collapse
        this.addTransition({
            from: GameRemoveCluster.STATE_NAME,
            to: GameCollapseField.STATE_NAME,
            guardCondition: (context) => {
                return context.currentCluster == null;
            },
        });
        
        // Collapse -> Refill
        this.addTransition({
            from: GameCollapseField.STATE_NAME,
            to: GameRefillGrid.STATE_NAME,
            guardCondition: (context) => {
                return context.isMovingItems == false;
            },
        });

        // Refill -> Collect
        this.addTransition({
            from: GameRefillGrid.STATE_NAME,
            to: GameCollectAllClusters.STATE_NAME,
            guardCondition: (context) => {
                return context.isMovingItems == false
                && context.droppedItems.length == 0;
            },
        });

         // Refill -> Drop
         this.addTransition({
            from: GameRefillGrid.STATE_NAME,
            to: GameLandDrop.STATE_NAME,
            guardCondition: (context) => {
                return context.isMovingItems == false
                && context.droppedItems.length != 0;
            },
        });

        // Drop -> Collect
        this.addTransition({
            from: GameLandDrop.STATE_NAME,
            to: GameCollectAllClusters.STATE_NAME
        });

        // Collect -> Reshuffle
        this.addTransition({
            from: GameCollectAllClusters.STATE_NAME,
            to: GameReshuffleField.STATE_NAME,
            guardCondition: (context) => {
                return context.needReshuffle 
                && context.canReshuffle == true;
            },
        });

        // Reshuffle -> Collect
        this.addTransition({
            from: GameReshuffleField.STATE_NAME,
            to: GameCollectAllClusters.STATE_NAME,
            guardCondition: (context) => {
                return context.needReshuffle
                && context.canReshuffle == true;
            },
        });
        
        // Collect -> IDLE
        this.addTransition({
            from: GameCollectAllClusters.STATE_NAME,
            to: GameIdle.STATE_NAME,
            guardCondition: (context) => {
                return context.needReshuffle == false
                && context.canReshuffle == true;
            },
        });

        // Reshuffle -> Game Over
        this.addTransition({
            from: GameReshuffleField.STATE_NAME,
            to: GameOver.STATE_NAME,
            guardCondition: (context) => {
                return context.needReshuffle
                && context.canReshuffle == false;
            },
        });

        // Reshuffle -> IDLE
        this.addTransition({
            from: GameReshuffleField.STATE_NAME,
            to: GameIdle.STATE_NAME,
            guardCondition: (context) => {
                return context.needReshuffle == false
                && context.canReshuffle == true;
            },
        });

        await this.setInitialState(GameFillField.STATE_NAME);
    }

    public async bind(node: Node): Promise<void> {
        this.context.gameNode = node;
        await this.setupStates();
        await this.setupTransitions();
        this.context.onClickedItemCb = this.onItemClicked.bind(this);
    }

    public unbind() {
        this.context.gameNode = null;
    }

    public onItemClicked(clickedItem: GameFieldItem): void {
         // Find the position of clicked item in the grid
         for (let i = 0; i < this.context.items.length; i++) {
            for (let j = 0; j < this.context.items[i].length; j++) {
                if (this.context.items[i][j] === clickedItem) {
                    console.log(`Clicked item at position [${i}, ${j}] of type ${clickedItem.ItemType}`);
                    var data = new SelectedItemData();
                    data.position = new Vec2(i, j);
                    data.item = clickedItem;
                    this.context.gameNode.emit(SelectedItemData.SELECTED_EVENT, data);
                }
            }
        }
    }
}