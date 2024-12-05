import { _decorator, Component, Prefab, UITransform, Node, Vec2, Vec3, Size, CCFloat} from "cc";
import { inject } from "../Libs/Injects/inject";
import { GameStateMachine } from "../Game/GameSM/GameSM";
import { IUIService } from "../Services/IUIService";
import { UIService } from "../Services/UIService";
import { Paddings } from "../UI/Paddiings";
const { ccclass, property } = _decorator;

@ccclass('GameField')
export class GameField extends Component {

    @property({ type: [Prefab] })
    public itemPrefabs: Prefab[] = [];

    @property({ type: [Prefab] })
    public dropPrefabs: Prefab[] = [];
    
    @property({ type: Node })
    public targetNode: Node = null;

    @property({ type: [Node] })
    public scaleTargets: Node[] = [];

    @property({ type: Node })
    public maskTarget: Node = null;

    @property({ type: CCFloat})
    public scaleTargetsPadding: Number = 0;

    @property({ type: Paddings, visible: true, serializable: true })
    public targetPaddings: Paddings = new Paddings();

    @property({ type: Paddings, visible: true, serializable: true })
    public maskPaddings: Paddings = new Paddings();

    private _uiService: IUIService = inject(UIService);

    private _stateMachine: GameStateMachine = inject(GameStateMachine);

    protected async start(): Promise<void> {
        this._stateMachine.setItems(this.itemPrefabs);
        this._stateMachine.setDrops(this.dropPrefabs);

        if (this.targetNode != null) {
            await this._stateMachine.bind(this.targetNode);
            await this._uiService.resetSize([this.targetNode], null);
            await this._uiService.resetSize(this.scaleTargets, this.targetPaddings);
            await this._uiService.resetSize([this.maskTarget], this.maskPaddings);
            return;
        }
        
        this._stateMachine.bind(this.node);
    }

    protected async update(dt: number): Promise<void> {
        await this._stateMachine.update();

    }
}