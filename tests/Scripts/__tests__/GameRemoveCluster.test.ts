import { GameRemoveCluster } from '../Game/GameSM/States/GameRemoveCluster';
import { GameContext } from '../Game/GameSM/GameContext';
import { GameFieldItem } from '../GameField/GameFieldItem';
import { Node } from 'cc';

// Mock cc module
jest.mock('cc');

// Mock GameFieldItem
jest.mock('../GameField/GameFieldItem');

describe('GameRemoveCluster', () => {
    let gameRemoveCluster: GameRemoveCluster;
    let context: GameContext;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();
        
        // Create instances
        gameRemoveCluster = new GameRemoveCluster();
        context = new GameContext();
        context.gameNode = new Node();
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
            
            // Create nodes for each item and spy on removeFromParent
            const node1 = new Node();
            const node2 = new Node();
            jest.spyOn(node1, 'removeFromParent');
            jest.spyOn(node2, 'removeFromParent');
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
            expect(context.items).toEqual([
                [null, null],
                [null, null]
            ]);
            expect(context.itemsPool).toEqual([item1, item2]);
            expect(context.dropsPool).toEqual([]);
            expect(node1.removeFromParent).toHaveBeenCalled();
            expect(node2.removeFromParent).toHaveBeenCalled();
        });

        it('should remove booster items and add them to dropsPool', async () => {
            // Setup
            const item1 = new GameFieldItem();
            const item2 = new GameFieldItem();
            item1.IsBooster = true;
            item2.IsBooster = true;
            
            // Create nodes for each item and spy on removeFromParent
            const node1 = new Node();
            const node2 = new Node();
            jest.spyOn(node1, 'removeFromParent');
            jest.spyOn(node2, 'removeFromParent');
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
            expect(context.items).toEqual([
                [null, null],
                [null, null]
            ]);
            expect(context.itemsPool).toEqual([]);
            expect(context.dropsPool).toEqual([item1, item2]);
            expect(node1.removeFromParent).toHaveBeenCalled();
            expect(node2.removeFromParent).toHaveBeenCalled();
        });

        it('should handle mixed items correctly', async () => {
            // Setup
            const regularItem = new GameFieldItem();
            const boosterItem = new GameFieldItem();
            regularItem.IsBooster = false;
            boosterItem.IsBooster = true;
            
            // Create nodes for each item and spy on removeFromParent
            const node1 = new Node();
            const node2 = new Node();
            jest.spyOn(node1, 'removeFromParent');
            jest.spyOn(node2, 'removeFromParent');
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
            expect(context.items).toEqual([
                [null, null],
                [null, null]
            ]);
            expect(context.itemsPool).toEqual([regularItem]);
            expect(context.dropsPool).toEqual([boosterItem]);
            expect(node1.removeFromParent).toHaveBeenCalled();
            expect(node2.removeFromParent).toHaveBeenCalled();
        });
    });
});
