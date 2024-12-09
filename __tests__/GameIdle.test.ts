// Mock dependencies
jest.mock('cc');
jest.mock('../assets/Scripts/GameField/GameFieldItem');
jest.mock('../assets/Scripts/Services/LevelConfiguration');
jest.mock('../assets/Scripts/Libs/Injects/inject');

// Import after mocking
import { GameIdle } from '../assets/Scripts/Game/GameSM/States/GameIdle';
import { GameContext } from '../assets/Scripts/Game/GameSM/GameContext';
import { GameTool } from '../assets/Scripts/Game/EnumGameTool';
import { SelectedItemData } from '../assets/Scripts/Game/Base/SelectedItemData';
import { Node } from 'cc';
import { inject } from '../assets/Scripts/Libs/Injects/inject';

jest.mock('cc');

describe('GameIdle', () => {
    let gameIdle: GameIdle;
    let context: GameContext;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();
        
        gameIdle = new GameIdle();
        context = new GameContext();
        context.gameNode = new Node();
    });

    describe('constructor', () => {
        it('should create instance with correct state name', () => {
            expect(gameIdle.name).toBe('GameIdle');
        });
    });

    describe('onEnter', () => {
        it('should set correct initial state', async () => {
            await gameIdle.onEnter(context);
            
            expect(context.currentTool).toBe(GameTool.SELECTOR);
            expect(context.skipMove).toBe(false);
        });

        it('should register item selection event listener', async () => {
            const spy = jest.spyOn(context.gameNode, 'on');
            
            await gameIdle.onEnter(context);
            
            expect(spy).toHaveBeenCalledWith(
                SelectedItemData.SELECTED_EVENT,
                expect.any(Function),
                expect.any(Object)
            );
        });
    });

    describe('onExit', () => {
        it('should unregister item selection event listener', async () => {
            await gameIdle.onEnter(context);
            
            const spy = jest.spyOn(context.gameNode, 'off');
            await gameIdle.onExit(context);
            
            expect(spy).toHaveBeenCalledWith(
                SelectedItemData.SELECTED_EVENT,
                expect.any(Function),
                expect.any(Object)
            );
        });
    });

    describe('onItemSelected', () => {
        it('should update context with selected item', async () => {
            await gameIdle.onEnter(context);
            
            const selectedItem = new SelectedItemData();
            const eventHandler = jest.spyOn(context.gameNode, 'on').mock.calls[0][1];
            eventHandler.call(gameIdle, selectedItem);
            
            expect(context.selectedItem).toBe(selectedItem);
        });
    });
});
