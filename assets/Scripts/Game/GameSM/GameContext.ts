import { Prefab, Node } from "cc";
import { singleton } from "../../Libs/Injects/decorators/singleton";
import { IGameContext } from "./IGameContext";
import { GameFieldItem } from "../../GameField/GameFieldItem";
import { LevelConfigurationService } from "../../Services/LevelConfiguration";
import { GameConfigurationService } from "../../Services/GameConfigurationService";
import { inject } from "../../Libs/Injects/inject";
import { IGameConfigurationService } from "../../Services/IGameConfigurationService";
import { ILevelConfigurationService } from "../../Services/ILevelConfiguration";
import { SelectedItemData } from "../Base/SelectedItemData";
import { IGameStatsObserver } from "./IGameStatsObserver";
import { GameTool } from "../EnumGameTool";
import { IGameToolObserver } from "./IGameToolObserver";

@singleton()

export class GameContext implements IGameContext {

    private _itemPrefabs: Prefab[] = null;
    private _dropPrefabs: Prefab[] = null;
    
    private _itemsPool: GameFieldItem[] = [];
    private _items: GameFieldItem[][] = [];
    private _dropsPool: GameFieldItem[] = [];
    
    private _gameNode: Node = null;

    private readonly _lvlConf: ILevelConfigurationService = inject(LevelConfigurationService);
    private readonly _gameConf: IGameConfigurationService = inject(GameConfigurationService);

    private _selectedItem: SelectedItemData = null;
    private _droppedItems: SelectedItemData[] = [];
    
    private _currentCluster: GameFieldItem[] = null;

    private _isMovingItems: boolean = false;
    private _remainClusters: GameFieldItem[][] = [];
    
    private _shuffleCounter: number = 0;
    
    private _onClickedItemCb: Function = null;

    private _gameScore: number = 0;
    private _gameMoves: number = 0;

    private _currentTool: GameTool = GameTool.SELECTOR;
    
    // observers
    private _observers: Set<IGameStatsObserver> = new Set();
    private _toolObservers: Set<IGameToolObserver> = new Set();

    public addToolObserver(observer: IGameToolObserver): void {
        this._toolObservers.add(observer);
    }

    public removeToolObserver(observer: IGameToolObserver): void {
        this._toolObservers.delete(observer);
    }

    public addObserver(observer: IGameStatsObserver): void {
        this._observers.add(observer);
    }

    public removeObserver(observer: IGameStatsObserver): void {
        this._observers.delete(observer);
    }

    private notifyScoreChanged(newScore: number): void {
        this._observers.forEach(observer => observer.onScoreChanged(newScore));
    }

    private notifyMovesChanged(newMoves: number): void {
        this._observers.forEach(observer => observer.onMovesChanged(newMoves));
    }

    private notifyToolChanged(newTool: GameTool): void {
        this._toolObservers.forEach(observer => observer.onToolChanged(newTool));
    }
    // ========================= Getters & Setters =========================

    public get dropPrefabs(): Prefab[] {
        return this._dropPrefabs;
    }
    
    public set dropPrefabs(value: Prefab[]) {
        this._dropPrefabs = value;
    }

    public get dropsPool(): GameFieldItem[] {
        return this._dropsPool;
    }
    public set dropsPool(value: GameFieldItem[]) {
        this._dropsPool = value;
    }

    public get droppedItems(): SelectedItemData[] {
        return this._droppedItems;
    }

    public set droppedItems(value: SelectedItemData[]) {
        this._droppedItems = value;
    }

    public get currentTool(): GameTool {
        return this._currentTool;
    }
    public set currentTool(value: GameTool) {
        if (this._currentTool != value){
            this._currentTool = value;
            this.notifyToolChanged(value);
        }
    }

    public get outOfMoves(): boolean {
        return this._gameMoves >= this.lvlConf.maxMoves;
    }

    public get pointTargetReached(): boolean {
        return this._gameScore >= this.lvlConf.targetScore;
    }

    public get gameMoves(): number {
        return this._gameMoves;
    }

    public set gameMoves(value: number) {
        if (this._gameMoves !== value) {
            this._gameMoves = value;
            this.notifyMovesChanged(value);
        }
    }

    public get gameScore(): number {
        return this._gameScore;
    }

    public set gameScore(value: number) {
        if (this._gameScore !== value) {
            this._gameScore = value;
            this.notifyScoreChanged(value);
        }
    }

    public get onClickedItemCb(): Function {
        return this._onClickedItemCb;
    }
    public set onClickedItemCb(value: Function) {
        this._onClickedItemCb = value;
    }

    public get shuffleCounter(): number {
        return this._shuffleCounter;
    }
    public set shuffleCounter(value: number) {
        this._shuffleCounter = value;
    }

    public get remainClusters(): GameFieldItem[][] {
        return this._remainClusters;
    }
    public set remainClusters(value: GameFieldItem[][]) {
        this._remainClusters = value;
    }

    public get isMovingItems(): boolean {
        return this._isMovingItems;
    }

    public set isMovingItems(value: boolean) {
        this._isMovingItems = value;
    }
    
    public get currentCluster(): GameFieldItem[] {
        return this._currentCluster;
    }

    public set currentCluster(value: GameFieldItem[]) {
        this._currentCluster = value;
    }

    public get selectedItem(): SelectedItemData {
        return this._selectedItem;
    }
    public set selectedItem(value: SelectedItemData) {
        this._selectedItem = value;
    }
    
    public get gameNode(): Node {
        return this._gameNode;
    }
    public set gameNode(value: Node) {
        this._gameNode = value;
    }
    
    public get items(): GameFieldItem[][] {
        return this._items;
    }
    public set items(value: GameFieldItem[][]) {
        this._items = value;
    }

    public get lvlConf(): ILevelConfigurationService {
        return this._lvlConf;
    }
    
    public get gameConf(): IGameConfigurationService {
        return this._gameConf;
    }

    public get itemPrefabs(): Prefab[] {
        return this._itemPrefabs;
    }
    public set itemPrefabs(value: Prefab[]) {
        this._itemPrefabs = value;
    }
    
    public get itemsPool(): GameFieldItem[] {
        return this._itemsPool;
    }
    public set itemsPool(value: GameFieldItem[]) {
        this._itemsPool = value;
    }

    public get canReshuffle(): boolean {
        return this._shuffleCounter <= this.gameConf.reshuffles;
    }

    public get needReshuffle(): boolean {
        return this.remainClusters.length == 0;
    }
}