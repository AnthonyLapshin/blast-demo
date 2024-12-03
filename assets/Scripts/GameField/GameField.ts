import { _decorator, Component, Prefab } from "cc";
import { inject } from "../Libs/Injects/inject";
import { GameStateMachine } from "../Game/GameSM/GameSM";
const { ccclass, property } = _decorator;

@ccclass('GameField')
export class GameField extends Component {

    @property({ type: [Prefab] })
    public itemPrefabs: Prefab[] = [];

    private _stateMachine: GameStateMachine = inject(GameStateMachine);

    protected start(): void {
        this._stateMachine.setItems(this.itemPrefabs);
        this._stateMachine.bind(this.node);
    }

    protected update(dt: number): void {
        this._stateMachine.update();
    }
}