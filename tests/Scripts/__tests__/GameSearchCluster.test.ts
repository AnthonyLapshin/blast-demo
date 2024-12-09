import { GameSearchCluster } from '../Game/GameSM/States/GameSearchCluster';
import { GameContext } from '../Game/GameSM/GameContext';
import { ClusterSeekerService } from '../Services/ClusterSeekerService';
import { SelectedItemData } from '../Game/Base/SelectedItemData';
import { GameFieldItem } from '../GameField/GameFieldItem';
import { Node } from 'cc';

// Mock GameFieldItem
jest.mock('../GameField/GameFieldItem');

describe('GameSearchCluster', () => {
    let gameSearchCluster: GameSearchCluster;
    let context: GameContext;
    let mockClusterSeeker: jest.Mocked<ClusterSeekerService>;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();
        
        // Create instances
        gameSearchCluster = new GameSearchCluster();
        context = new GameContext();
        context.gameNode = new Node();

        // Setup mock cluster seeker
        mockClusterSeeker = {
            CollectCluster: jest.fn()
        } as unknown as jest.Mocked<ClusterSeekerService>;
        (gameSearchCluster as any)._clusterSeeker = mockClusterSeeker;

        // Setup default context
        const gameConf = {
            minClusterSize: 2,
            startPointsAmount: 0,
            fieldWidth: 5,
            fieldHeight: 5
        };
        Object.defineProperty(context, 'gameConf', {
            get: () => gameConf
        });
        context.items = Array(25).fill(null);
    });

    describe('constructor', () => {
        it('should create instance with correct state name', () => {
            expect(gameSearchCluster.name).toBe('GameSearchCluster');
        });
    });

    describe('onEnter', () => {
        it('should set cluster directly when item is a booster', async () => {
            // Setup
            const selectedItem = new GameFieldItem();
            selectedItem.IsBooster = true;
            context.selectedItem = new SelectedItemData();
            context.selectedItem.item = selectedItem;

            // Execute
            await gameSearchCluster.onEnter(context);

            // Verify
            expect(context.currentCluster).toEqual([selectedItem]);
            expect(mockClusterSeeker.CollectCluster).not.toHaveBeenCalled();
        });

        it('should set cluster when found cluster size meets minimum requirement', async () => {
            // Setup
            const selectedItem = new GameFieldItem();
            selectedItem.IsBooster = false;
            context.selectedItem = new SelectedItemData();
            context.selectedItem.item = selectedItem;
            const position = { x: 1, y: 1 };
            Object.defineProperty(context.selectedItem, 'position', {
                get: () => position
            });

            const mockCluster = [
                selectedItem,
                new GameFieldItem(),
                new GameFieldItem()
            ];
            mockClusterSeeker.CollectCluster.mockReturnValue(mockCluster);

            // Execute
            await gameSearchCluster.onEnter(context);

            // Verify
            expect(context.currentCluster).toBe(mockCluster);
            expect(mockClusterSeeker.CollectCluster).toHaveBeenCalledWith(
                context.items,
                context.gameConf.minClusterSize,
                position.x,
                position.y,
                'ItemType'
            );
        });

        it('should clear selected item when found cluster size is too small', async () => {
            // Setup
            const selectedItem = new GameFieldItem();
            selectedItem.IsBooster = false;
            context.selectedItem = new SelectedItemData();
            context.selectedItem.item = selectedItem;
            const position = { x: 1, y: 1 };
            Object.defineProperty(context.selectedItem, 'position', {
                get: () => position
            });

            const mockCluster = [selectedItem]; // Only one item, less than minClusterSize
            mockClusterSeeker.CollectCluster.mockReturnValue(mockCluster);

            // Execute
            await gameSearchCluster.onEnter(context);

            // Verify
            expect(context.selectedItem).toBeNull();
            expect(context.currentCluster).toBeNull();
            expect(mockClusterSeeker.CollectCluster).toHaveBeenCalledWith(
                context.items,
                context.gameConf.minClusterSize,
                position.x,
                position.y,
                'ItemType'
            );
        });
    });
});
