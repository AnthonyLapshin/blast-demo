// Mock dependencies
jest.mock('cc');
jest.mock('../assets/Scripts/GameField/GameFieldItem');
jest.mock('../assets/Scripts/Services/LevelConfiguration');
jest.mock('../assets/Scripts/Libs/Injects/inject');

// Import after mocking
import { GameRemoveCluster } from '../assets/Scripts/Game/GameSM/States/GameRemoveCluster';
import { GameContext } from '../assets/Scripts/Game/GameSM/GameContext';
import { GameFieldItem } from '../assets/Scripts/GameField/GameFieldItem';
import { Node } from 'cc';
import { inject } from '../assets/Scripts/Libs/Injects/inject';

describe('GameRemoveCluster', () => {
    let gameRemoveCluster: GameRemoveCluster;
    let context: GameContext;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();
        
        // Create instances
        gameRemoveCluster = new GameRemoveCluster();
        context = new GameContext();
        const gameNode = new Node();
        gameNode.addChild = jest.fn();
        gameNode.removeFromParent = jest.fn();
        gameNode.getComponent = jest.fn();
        context.gameNode = gameNode;
        context.items = [];
        context.itemsPool = [];
        context.dropsPool = [];
    });

    describe('constructor', () => {
        it('should create instance with correct state name', () => {
            expect(gameRemoveCluster.name).toBe('GameRemoveCluster');
        });
    });

    describe('onEnter', () => {
        it('should do nothing when current cluster is null', async () => {
            // Setup
            context.currentCluster = null;

            // Execute
            await gameRemoveCluster.onEnter(context);

            // Verify
            expect(context.items).toEqual([]);
            expect(context.itemsPool).toEqual([]);
            expect(context.dropsPool).toEqual([]);
        });

        it('should do nothing when current cluster is empty', async () => {
            // Setup
            context.currentCluster = [];

            // Execute
            await gameRemoveCluster.onEnter(context);

            // Verify
            expect(context.items).toEqual([]);
            expect(context.itemsPool).toEqual([]);
            expect(context.dropsPool).toEqual([]);
        });

        it('should remove regular items and add them to itemsPool', async () => {
            // Setup
            const item1 = new GameFieldItem();
            const item2 = new GameFieldItem();
            item1.IsBooster = false;
            item2.IsBooster = false;
            
            // Create nodes for each item
            const node1 = new Node();
            const node2 = new Node();
            node1.removeFromParent = jest.fn();
            node2.removeFromParent = jest.fn();
            item1.node = node1;
            item2.node = node2;
            
            context.items = [
                [item1, null],
                [item2, null]
            ];
            context.currentCluster = [item1, item2];

            // Execute
            await gameRemoveCluster.onEnter(context);

            // Verify
            expect(node1.removeFromParent).toHaveBeenCalledTimes(1);
            expect(node2.removeFromParent).toHaveBeenCalledTimes(1);
            expect(context.itemsPool).toContain(item1);
            expect(context.itemsPool).toContain(item2);
            expect(context.dropsPool).toHaveLength(0);
        });

        it('should remove booster items and add them to dropsPool', async () => {
            // Setup
            const item1 = new GameFieldItem();
            const item2 = new GameFieldItem();
            item1.IsBooster = true;
            item2.IsBooster = true;
            
            // Create nodes for each item
            const node1 = new Node();
            const node2 = new Node();
            node1.removeFromParent = jest.fn();
            node2.removeFromParent = jest.fn();
            item1.node = node1;
            item2.node = node2;
            
            context.items = [
                [item1, null],
                [item2, null]
            ];
            context.currentCluster = [item1, item2];

            // Execute
            await gameRemoveCluster.onEnter(context);

            // Verify
            expect(node1.removeFromParent).toHaveBeenCalledTimes(1);
            expect(node2.removeFromParent).toHaveBeenCalledTimes(1);
            expect(context.dropsPool).toContain(item1);
            expect(context.dropsPool).toContain(item2);
            expect(context.itemsPool).toHaveLength(0);
        });

        it('should handle mixed items correctly', async () => {
            // Setup
            const regularItem = new GameFieldItem();
            const boosterItem = new GameFieldItem();
            regularItem.IsBooster = false;
            boosterItem.IsBooster = true;
            
            // Create nodes for each item
            const node1 = new Node();
            const node2 = new Node();
            node1.removeFromParent = jest.fn();
            node2.removeFromParent = jest.fn();
            regularItem.node = node1;
            boosterItem.node = node2;
            
            context.items = [
                [regularItem, null],
                [boosterItem, null]
            ];
            context.currentCluster = [regularItem, boosterItem];

            // Execute
            await gameRemoveCluster.onEnter(context);

            // Verify
            expect(node1.removeFromParent).toHaveBeenCalledTimes(1);
            expect(node2.removeFromParent).toHaveBeenCalledTimes(1);
            expect(context.itemsPool).toContain(regularItem);
            expect(context.dropsPool).toContain(boosterItem);
            expect(context.itemsPool).toHaveLength(1);
            expect(context.dropsPool).toHaveLength(1);
        });
    });
});
