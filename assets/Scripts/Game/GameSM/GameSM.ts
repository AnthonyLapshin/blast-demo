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
                && context.currentTool == GameTool.SELECTOR;
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
                return context.isMovingItems == false;
            },
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
                    console.log("!>> ", this.context.gameNode.hasEventListener(SelectedItemData.SELECTED_EVENT));
                    this.context.gameNode.emit(SelectedItemData.SELECTED_EVENT, data);
                }
            }
        }
    }
}