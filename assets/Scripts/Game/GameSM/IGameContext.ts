import { Prefab, Node } from "cc";
import { GameFieldItem } from "../../GameField/GameFieldItem";
import { IGameConfigurationService } from "../../Services/IGameConfigurationService";
import { ILevelConfigurationService } from "../../Services/ILevelConfiguration";
import { SelectedItemData } from "../Base/SelectedItemData";
import { GameTool } from "../EnumGameTool";

export interface IGameContext {

    get currentTool(): GameTool;
    set currentTool(value: GameTool);

    get outOfMoves(): boolean;
    get pointTargetReached(): boolean;
    
    get gameScore(): number
    set gameScore(value: number)
    
    get items(): GameFieldItem[][];
    set items(value: GameFieldItem[][]);
    
    get lvlConf(): ILevelConfigurationService;
    get gameConf(): IGameConfigurationService;
    
    get itemPrefabs(): Prefab[];
    set itemPrefabs(value: Prefab[]);

    get itemsPool(): GameFieldItem[];
    set itemsPool(value: GameFieldItem[]);

    get gameNode(): Node ;
    set gameNode(value: Node);

    get selectedItem(): SelectedItemData ;
    set selectedItem(value: SelectedItemData) ;

    get currentCluster(): GameFieldItem[];
    set currentCluster(value: GameFieldItem[]);

    get isMovingItems(): boolean;
    set isMovingItems(value: boolean);

    get dropsPool(): GameFieldItem[];
    set dropsPool(value: GameFieldItem[]);

    get dropPrefabs(): Prefab[];
    set dropPrefabs(value: Prefab[]);
}