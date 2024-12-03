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

@singleton()
export class GameStateMachine extends FiniteStateMachine<GameContext> 
{
    public static readonly CLICKED_EVENT: string = 'item-clicked';
    
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

    private setupStates() : void {
        this.addState(new GameFillField());
        this.addState(new GameIdle());
        this.addState(new GameSearchCluster());
        this.addState(new GameRemoveCluster());
        this.addState(new GameCollapseField());
        this.addState(new GameRefillGrid());
        this.addState(new GameCollectAllClusters());
        this.addState(new GameReshuffleField());
        this.addState(new GameOver());
    }
    
    // init -> IDLE
    private setupTransitions() : void{
        this.addTransition({
            from: GameFillField.STATE_NAME,
            to: GameIdle.STATE_NAME,
            guardCondition: (context) => {
                return context.needReshuffle == false 
                &&context.items.length >0 
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
                return context.selectedItem != null;
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

        this.addTransition({
            from: GameSearchCluster.STATE_NAME,
            to: GameRemoveCluster.STATE_NAME,
            guardCondition: (context) => {
                return context.currentCluster != null;
            },
        });

        this.addTransition({
            from: GameRemoveCluster.STATE_NAME,
            to: GameCollapseField.STATE_NAME,
            guardCondition: (context) => {
                return context.currentCluster == null;
            },
        });

        this.addTransition({
            from: GameCollapseField.STATE_NAME,
            to: GameRefillGrid.STATE_NAME,
            guardCondition: (context) => {
                return context.isMovingItems == false;
            },
        });

        this.addTransition({
            from: GameRefillGrid.STATE_NAME,
            to: GameCollectAllClusters.STATE_NAME,
            guardCondition: (context) => {
                return context.isMovingItems == false;
            },
        });

        this.addTransition({
            from: GameCollectAllClusters.STATE_NAME,
            to: GameReshuffleField.STATE_NAME,
            guardCondition: (context) => {
                return context.needReshuffle 
                && context.canReshuffle == true;
            },
        });

        this.addTransition({
            from: GameReshuffleField.STATE_NAME,
            to: GameCollectAllClusters.STATE_NAME,
            guardCondition: (context) => {
                return context.needReshuffle
                && context.canReshuffle == true;
            },
        });

        this.addTransition({
            from: GameCollectAllClusters.STATE_NAME,
            to: GameIdle.STATE_NAME,
            guardCondition: (context) => {
                return context.needReshuffle == false
                && context.canReshuffle == true;
            },
        });

        this.addTransition({
            from: GameReshuffleField.STATE_NAME,
            to: GameOver.STATE_NAME,
            guardCondition: (context) => {
                return context.needReshuffle
                && context.canReshuffle == false;
            },
        });

        this.addTransition({
            from: GameReshuffleField.STATE_NAME,
            to: GameIdle.STATE_NAME,
            guardCondition: (context) => {
                return context.needReshuffle == false
                && context.canReshuffle == true;
            },
        });

        this.setInitialState(GameFillField.STATE_NAME);
    }

    public bind(node: Node) {
        this.context.gameNode = node;
        const conf = this.context.lvlConf;
        const transform = node.getComponent(UITransform);
        
        const pixelWidth = conf.width * conf.cellWidth;
        const pixelHeight = conf.height * conf.cellHeight;

        transform.setContentSize(pixelWidth, pixelHeight);

        var adjustmentHeight = conf.cellHeight %2 == 0? 0 : conf.cellHeight;
        var adjustmentWidth = conf.cellWidth %2 == 0? 0 : conf.cellWidth;
        
        // Center the node
        node.setPosition(
            -(transform.width * transform.node.scale.x - adjustmentWidth/2) / 2,
            -(transform.height * transform.node.scale.y - adjustmentHeight/2) / 2
        );

        this.setupStates();
        this.setupTransitions();
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