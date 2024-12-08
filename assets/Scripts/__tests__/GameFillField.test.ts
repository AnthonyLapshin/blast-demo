import { GameFillField } from '../Game/GameSM/States/GameFillField';
import { GameContext } from '../Game/GameSM/GameContext';
import { Node, Prefab, instantiate, Component } from 'cc';
import { ClusterSeekerService } from '../Services/ClusterSeekerService';
import { FieldCoordinatesService } from '../Services/FieldCoordinatesService';
import { LevelConfigurationService } from '../Services/LevelConfiguration';
import { GameFieldItem } from '../GameField/GameFieldItem';

jest.mock('cc');
jest.mock('../Libs/utils/ArrayUtils');

describe('GameFillField', () => {
    let gameFillField: GameFillField;
    let context: GameContext;
    let mockClusterSeeker: jest.Mocked<ClusterSeekerService>;
    let mockCoordinatesService: jest.Mocked<FieldCoordinatesService>;
    let mockLvlConf: jest.Mocked<LevelConfigurationService>;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Initialize state and context
        gameFillField = new GameFillField();
        context = new GameContext();
        context.gameNode = new Node();
        context.items = [];
        context.itemsPool = [];
        context.dropsPool = [];
        
        // Mock game configuration
        Object.defineProperty(context, 'gameConf', {
            value: {
                startPointsAmount: 1000,
                itemPrefab: new Prefab(),
                minClusterSize: 2,
                reshuffles: 3
            },
            writable: true
        });
        
        // Mock level configuration
        Object.defineProperty(context, 'lvlConf', {
            value: {
                width: 5,
                height: 5,
                minClusterSize: 2,
                cellWidth: 171,
                cellHeight: 192
            },
            writable: true
        });

        // Set up drop prefabs and item prefabs
        const itemPrefab = new Prefab();
        const dropPrefab = new Prefab();
        
        Object.defineProperty(context, 'dropPrefabs', {
            value: [dropPrefab],
            writable: true,
            configurable: true
        });

        Object.defineProperty(context, 'itemPrefabs', {
            value: [itemPrefab],
            writable: true,
            configurable: true
        });

        // Mock services
        mockClusterSeeker = {
            FindAllClusters: jest.fn().mockReturnValue([[{ x: 0, y: 0 }]]), // Return non-empty array to avoid reshuffle
            findClusters: jest.fn(),
        } as unknown as jest.Mocked<ClusterSeekerService>;

        mockCoordinatesService = {
            fieldToWorldCoordsinates: jest.fn().mockReturnValue({ x: 0, y: 0 }),
            getWorldPosition: jest.fn(),
        } as unknown as jest.Mocked<FieldCoordinatesService>;

        mockLvlConf = {
            getRandomItemType: jest.fn().mockReturnValue(1),
        } as unknown as jest.Mocked<LevelConfigurationService>;

        // Mock services injection
        Object.defineProperty(gameFillField, '_clusterSeeker', {
            value: mockClusterSeeker,
            writable: true,
            configurable: true
        });

        Object.defineProperty(gameFillField, '_coordinatesService', {
            value: mockCoordinatesService,
            writable: true,
            configurable: true
        });

        Object.defineProperty(gameFillField, '_lvlConf', {
            value: mockLvlConf,
            writable: true,
            configurable: true
        });

        // Mock onClickedItemCb
        context.onClickedItemCb = jest.fn();
    });

    describe('constructor', () => {
        it('should create instance with correct state name', () => {
            expect(gameFillField.name).toBe('GameFillField');
        });
    });

    describe('onEnter', () => {
        it('should initialize game score with startPointsAmount', async () => {
            await gameFillField.onEnter(context);
            expect(context.gameScore).toBe(context.gameConf.startPointsAmount);
        });

        it('should create items array with correct dimensions', async () => {
            await gameFillField.onEnter(context);
            expect(context.items.length).toBe(context.lvlConf.width);
            expect(context.items[0].length).toBe(context.lvlConf.height);
        });

        it('should fill the field with game items', async () => {
            await gameFillField.onEnter(context);
            
            // Check if instantiate was called correct number of times:
            // - 2 instantiations per grid cell (pool item + game item)
            // - 1 instantiation per drop prefab
            const gridCells = context.lvlConf.width * context.lvlConf.height;
            const expectedCalls = (gridCells * 2) + context.dropPrefabs.length;
            expect(instantiate).toHaveBeenCalledTimes(expectedCalls);
            
            // Check if items were added to the pool
            expect(context.itemsPool.length).toBeGreaterThan(0);
            expect(context.dropsPool.length).toBe(context.dropPrefabs.length);
        });
    });
});
