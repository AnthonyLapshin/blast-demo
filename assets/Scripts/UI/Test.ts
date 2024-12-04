import { _decorator, Component, Node } from 'cc';
import { GameContext } from '../Game/GameSM/GameContext';
import { inject } from '../Libs/Injects/inject';
import { GameTool } from '../Game/EnumGameTool';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {
    private _context: GameContext = inject(GameContext);
    start() {
        console.log(`[TEST] Current tool: ${this._context.currentTool}`);
    }

    update(deltaTime: number) {
        
    }

    public onClick() {
        this._context.currentTool = GameTool.BOMB_2;
        console.log(`[TEST] Current tool: ${this._context.currentTool}`);
    }

}

