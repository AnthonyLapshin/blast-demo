// Mock dependencies before importing the class
jest.mock('cc');
jest.mock('../GameField/GameFieldItem');
jest.mock('../Libs/utils/ArrayUtils');
jest.mock('../Services/FieldCoordinatesService');
jest.mock('../Services/ClusterSeekerService');
jest.mock('../Services/LevelConfiguration');
jest.mock('../Libs/Injects/inject');

// Import after mocking
import { GameFillField } from '../Game/GameSM/States/GameFillField';
import { GameContext } from '../Game/GameSM/GameContext';
import { Node } from 'cc';
import { GameFieldItem } from '../GameField/GameFieldItem';
import * as cc from 'cc';
import { ArrayUtils } from '../Libs/utils/ArrayUtils';
import { inject } from '../Libs/Injects/inject';

describe('GameFillField', () => {
    let gameFillField: GameFillField;
    let context: GameContext;
    let mockPrefab: any;
    let mockGameFieldItem: GameFieldItem;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Mock inject function before creating GameFillField instance
        (inject as jest.Mock).mockImplementation((type) => {
            if (type.name === 'FieldCoordinatesService') {
                return {
                    fieldToWorldCoordsinates: jest.fn().mockReturnValue({ x: 0, y: 0 }),
                    GetFieldPosition: jest.fn().mockReturnValue({ x: 0, y: 0 })
                };
            } else if (type.name === 'ClusterSeekerService') {
                return {
                    FindAllClusters: jest.fn().mockReturnValue([[{ x: 0, y: 0 }]])
                };
            } else if (type.name === 'LevelConfigurationService') {
                return {
                    GetLevelConfiguration: jest.fn().mockReturnValue({
                        width: 5,
                        height: 5,
                        minClusterSize: 2
                    })
                };
            }
            return new type();
        });
        
        // Create a mock GameFieldItem
        mockGameFieldItem = new GameFieldItem();
        mockGameFieldItem.ItemType = '1';
        mockGameFieldItem.IsBooster = false;

        // Create a mock node with the GameFieldItem component
        const mockNode = new Node();
        mockNode.getComponent = jest.fn().mockReturnValue(mockGameFieldItem);
        mockGameFieldItem.node = mockNode;

        // Set up mock prefab
        mockPrefab = {
            data: mockNode
        };

        // Mock ArrayUtils.getRandomItem to return our mock prefab
        (ArrayUtils.getRandomItem as jest.Mock).mockReturnValue(mockPrefab);

        // Mock cc.instantiate to return a new node with the component
        ((cc as any).instantiate as jest.Mock).mockImplementation((prefab) => {
            const node = new Node();
            node.getComponent = jest.fn().mockReturnValue(mockGameFieldItem);
            return node;
        });

        // Initialize state and context
        gameFillField = new GameFillField();
        context = new GameContext();
        
        // Set up context with required properties
        context.gameNode = new Node();
        context.itemPrefabs = [mockPrefab];
        context.dropPrefabs = [mockPrefab]; 
        context.itemsPool = [];
        context.dropsPool = [];
        context.items = [];
        context.gameScore = 0;

        // Set up read-only properties using Object.defineProperty
        Object.defineProperty(context, 'gameConf', {
            get: () => ({
                startPointsAmount: 0,
                minClusterSize: 2
            })
        });

        Object.defineProperty(context, 'lvlConf', {
            get: () => ({
                width: 5,
                height: 5
            })
        });
    });

    describe('onEnter', () => {
        it('should initialize game score and create items array', async () => {
            await gameFillField.onEnter(context);
            
            expect(context.gameScore).toBe(0);
            expect(context.items.length).toBe(context.lvlConf.width);
            expect(context.items[0].length).toBe(context.lvlConf.height);
        });

        it('should fill field with game items', async () => {
            const instantiateSpy = jest.spyOn(cc as any, 'instantiate');
            
            await gameFillField.onEnter(context);
            
            // Verify items were created (2 items per grid position + boosters)
            const expectedInstantiations = (context.lvlConf.width * context.lvlConf.height * 2) + context.dropPrefabs.length;
            expect(instantiateSpy).toHaveBeenCalledTimes(expectedInstantiations);
            
            // Verify pools were initialized
            expect(context.itemsPool).toBeDefined();
            expect(context.dropsPool).toBeDefined();
            
            // Verify item properties
            const item = context.items[0][0];
            expect(item).toBeDefined();
            expect(item.ItemType).toBe('1');
            expect(item.IsBooster).toBe(false);
            expect(item.node).toBeDefined();
            expect(item.node.on).toBeDefined();
        });

        it('should handle item click events', async () => {
            await gameFillField.onEnter(context);
            
            const item = context.items[0][0];
            expect(item).toBeDefined();
            expect(item.ItemType).toBe('1');
            expect(item.IsBooster).toBe(false);
            expect(item.node).toBeDefined();
            expect(item.node.on).toBeDefined();
        });
    });
});
