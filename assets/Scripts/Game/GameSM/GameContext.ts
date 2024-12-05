/**
 * @file GameContext.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

import { Prefab, Node } from "cc";
import { singleton } from "../../Libs/Injects/decorators/singleton";
import { IGameContext } from "./States/Observers/IGameContext";
import { GameFieldItem } from "../../GameField/GameFieldItem";
import { LevelConfigurationService } from "../../Services/LevelConfiguration";
import { GameConfigurationService } from "../../Services/GameConfigurationService";
import { inject } from "../../Libs/Injects/inject";
import { IGameConfigurationService } from "../../Services/Interfaces/IGameConfigurationService";
import { ILevelConfigurationService } from "../../Services/Interfaces/ILevelConfiguration";
import { SelectedItemData } from "../Base/SelectedItemData";
import { IGameStatsObserver } from "./States/Observers/IGameStatsObserver";
import { GameTool } from "../EnumGameTool";
import { IGameToolObserver } from "./States/Observers/IGameToolObserver";

/**
 * Represents the core game context that maintains the current state of the game.
 * This class holds all the essential game data including the game field, selected items,
 * current tools, scores, and other game-related information needed across different game states.
 */
@singleton()
export class GameContext implements IGameContext {

    /**
     * Prefabs for game items.
     */
    private _itemPrefabs: Prefab[] = null;

    /**
     * Prefabs for game drops.
     */
    private _dropPrefabs: Prefab[] = null;

    /**
     * Pool of game field items.
     */
    private _itemsPool: GameFieldItem[] = [];

    /**
     * Current game field items in a 2D array.
     */
    private _items: GameFieldItem[][] = [];

    /**
     * Pool of game drops.
     */
    private _dropsPool: GameFieldItem[] = [];

    /**
     * The game node in the scene.
     */
    private _gameNode: Node = null;

    /**
     * Level configuration service.
     */
    private readonly _lvlConf: ILevelConfigurationService = inject(LevelConfigurationService);

    /**
     * Game configuration service.
     */
    private readonly _gameConf: IGameConfigurationService = inject(GameConfigurationService);

    /**
     * Currently selected item on the field.
     */
    private _selectedItem: SelectedItemData = null;

    /**
     * Items that have been dropped and need processing.
     */
    private _droppedItems: SelectedItemData[] = [];

    /**
     * Current cluster of items being processed.
     */
    private _currentCluster: GameFieldItem[] = null;

    /**
     * Flag indicating if a move is in progress.
     */
    private _isMovingItems: boolean = false;

    /**
     * Remaining clusters of items.
     */
    private _remainClusters: GameFieldItem[][] = [];

    /**
     * Shuffle counter.
     */
    private _shuffleCounter: number = 0;

    /**
     * Callback function for when an item is clicked.
     */
    private _onClickedItemCb: Function = null;

    /**
     * Current game score.
     */
    private _gameScore: number = 0;

    /**
     * Number of moves remaining.
     */
    private _gameMoves: number = 0;

    /**
     * Current game tool being used.
     */
    private _currentTool: GameTool = GameTool.SELECTOR;

    /**
     * Observers for game stats.
     */
    private _observers: Set<IGameStatsObserver> = new Set();

    /**
     * Observers for game tools.
     */
    private _toolObservers: Set<IGameToolObserver> = new Set();

    /**
     * Adds a tool observer.
     * @param observer The observer to add.
     */
    public addToolObserver(observer: IGameToolObserver): void {
        this._toolObservers.add(observer);
    }

    /**
     * Removes a tool observer.
     * @param observer The observer to remove.
     */
    public removeToolObserver(observer: IGameToolObserver): void {
        this._toolObservers.delete(observer);
    }

    /**
     * Adds a game stats observer.
     * @param observer The observer to add.
     */
    public addObserver(observer: IGameStatsObserver): void {
        this._observers.add(observer);
    }

    /**
     * Removes a game stats observer.
     * @param observer The observer to remove.
     */
    public removeObserver(observer: IGameStatsObserver): void {
        this._observers.delete(observer);
    }

    /**
     * Notifies observers that the score has changed.
     * @param newScore The new score.
     */
    private notifyScoreChanged(newScore: number): void {
        this._observers.forEach(observer => observer.onScoreChanged(newScore));
    }

    /**
     * Notifies observers that the moves have changed.
     * @param newMoves The new moves.
     */
    private notifyMovesChanged(newMoves: number): void {
        this._observers.forEach(observer => observer.onMovesChanged(newMoves));
    }

    /**
     * Notifies observers that the tool has changed.
     * @param newTool The new tool.
     */
    private notifyToolChanged(newTool: GameTool): void {
        this._toolObservers.forEach(observer => observer.onToolChanged(newTool));
    }
    
    /**
     * Flag to indicate if the current move should be skipped.
     * When true, the game will bypass the current move without affecting the game state.
     */
    private _skipMove: boolean = false;
    
    // ========================= Getters & Setters =========================


    public get skipMove(): boolean {
        return this._skipMove;
    }

    public set skipMove(value: boolean) {
        this._skipMove = value;
    }

    /**
     * Gets the drop prefabs.
     */
    public get dropPrefabs(): Prefab[] {
        return this._dropPrefabs;
    }

    /**
     * Sets the drop prefabs.
     * @param value The new drop prefabs.
     */
    public set dropPrefabs(value: Prefab[]) {
        this._dropPrefabs = value;
    }

    /**
     * Gets the drops pool.
     */
    public get dropsPool(): GameFieldItem[] {
        return this._dropsPool;
    }

    /**
     * Sets the drops pool.
     * @param value The new drops pool.
     */
    public set dropsPool(value: GameFieldItem[]) {
        this._dropsPool = value;
    }

    /**
     * Gets the dropped items.
     */
    public get droppedItems(): SelectedItemData[] {
        return this._droppedItems;
    }

    /**
     * Sets the dropped items.
     * @param value The new dropped items.
     */
    public set droppedItems(value: SelectedItemData[]) {
        this._droppedItems = value;
    }

    /**
     * Gets the current tool.
     */
    public get currentTool(): GameTool {
        return this._currentTool;
    }

    /**
     * Sets the current tool.
     * @param value The new current tool.
     */
    public set currentTool(value: GameTool) {
        if (this._currentTool != value) {
            this._currentTool = value;
            this.notifyToolChanged(value);
        }
    }

    /**
     * Gets whether the game is out of moves.
     */
    public get outOfMoves(): boolean {
        return this._gameMoves >= this.lvlConf.maxMoves;
    }

    /**
     * Gets whether the point target has been reached.
     */
    public get pointTargetReached(): boolean {
        return this._gameScore >= this.lvlConf.targetScore;
    }

    /**
     * Gets the game moves.
     */
    public get gameMoves(): number {
        return this._gameMoves;
    }

    /**
     * Sets the game moves.
     * @param value The new game moves.
     */
    public set gameMoves(value: number) {
        if (this._gameMoves !== value) {
            this._gameMoves = value;
            this.notifyMovesChanged(value);
        }
    }

    /**
     * Gets the game score.
     */
    public get gameScore(): number {
        return this._gameScore;
    }

    /**
     * Sets the game score.
     * @param value The new game score.
     */
    public set gameScore(value: number) {
        if (this._gameScore !== value) {
            this._gameScore = value;
            this.notifyScoreChanged(value);
        }
    }

    /**
     * Gets the on clicked item callback.
     */
    public get onClickedItemCb(): Function {
        return this._onClickedItemCb;
    }

    /**
     * Sets the on clicked item callback.
     * @param value The new on clicked item callback.
     */
    public set onClickedItemCb(value: Function) {
        this._onClickedItemCb = value;
    }

    /**
     * Gets the shuffle counter.
     */
    public get shuffleCounter(): number {
        return this._shuffleCounter;
    }

    /**
     * Sets the shuffle counter.
     * @param value The new shuffle counter.
     */
    public set shuffleCounter(value: number) {
        this._shuffleCounter = value;
    }

    /**
     * Gets the remaining clusters.
     */
    public get remainClusters(): GameFieldItem[][] {
        return this._remainClusters;
    }

    /**
     * Sets the remaining clusters.
     * @param value The new remaining clusters.
     */
    public set remainClusters(value: GameFieldItem[][]) {
        this._remainClusters = value;
    }

    /**
     * Gets whether the game is moving items.
     */
    public get isMovingItems(): boolean {
        return this._isMovingItems;
    }

    /**
     * Sets whether the game is moving items.
     * @param value The new is moving items.
     */
    public set isMovingItems(value: boolean) {
        this._isMovingItems = value;
    }

    /**
     * Gets the current cluster.
     */
    public get currentCluster(): GameFieldItem[] {
        return this._currentCluster;
    }

    /**
     * Sets the current cluster.
     * @param value The new current cluster.
     */
    public set currentCluster(value: GameFieldItem[]) {
        this._currentCluster = value;
    }

    /**
     * Gets the selected item.
     */
    public get selectedItem(): SelectedItemData {
        return this._selectedItem;
    }

    /**
     * Sets the selected item.
     * @param value The new selected item.
     */
    public set selectedItem(value: SelectedItemData) {
        this._selectedItem = value;
    }

    /**
     * Gets the game node.
     */
    public get gameNode(): Node {
        return this._gameNode;
    }

    /**
     * Sets the game node.
     * @param value The new game node.
     */
    public set gameNode(value: Node) {
        this._gameNode = value;
    }

    /**
     * Gets the items.
     */
    public get items(): GameFieldItem[][] {
        return this._items;
    }

    /**
     * Sets the items.
     * @param value The new items.
     */
    public set items(value: GameFieldItem[][]) {
        this._items = value;
    }

    /**
     * Gets the level configuration.
     */
    public get lvlConf(): ILevelConfigurationService {
        return this._lvlConf;
    }

    /**
     * Gets the game configuration.
     */
    public get gameConf(): IGameConfigurationService {
        return this._gameConf;
    }

    /**
     * Gets the item prefabs.
     */
    public get itemPrefabs(): Prefab[] {
        return this._itemPrefabs;
    }

    /**
     * Sets the item prefabs.
     * @param value The new item prefabs.
     */
    public set itemPrefabs(value: Prefab[]) {
        this._itemPrefabs = value;
    }

    /**
     * Gets the items pool.
     */
    public get itemsPool(): GameFieldItem[] {
        return this._itemsPool;
    }

    /**
     * Sets the items pool.
     * @param value The new items pool.
     */
    public set itemsPool(value: GameFieldItem[]) {
        this._itemsPool = value;
    }

    /**
     * Gets whether the game can reshuffle.
     */
    public get canReshuffle(): boolean {
        return this._shuffleCounter <= this.gameConf.reshuffles;
    }

    /**
     * Gets whether the game needs to reshuffle.
     */
    public get needReshuffle(): boolean {
        return this.remainClusters.length == 0;
    }
}