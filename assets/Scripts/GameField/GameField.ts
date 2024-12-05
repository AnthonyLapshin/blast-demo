/**
 * @file GameField.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

import { _decorator, Component, Prefab, UITransform, Node, Vec2, Vec3, Size, CCFloat} from "cc";
import { inject } from "../Libs/Injects/inject";
import { GameStateMachine } from "../Game/GameSM/GameSM";
import { IUIService } from "../Services/Interfaces/IUIService";
import { UIService } from "../Services/UIService";
import { Paddings } from "../UI/Paddings";
const { ccclass, property } = _decorator;

/**
 * Represents the main game field component that manages the game field's UI and layout.
 * This class handles the initialization of the game field, binding of the game state machine,
 * and updating of the game field's UI.
 */
@ccclass('GameField')
export class GameField extends Component {

    /**
     * The prefabs for the game items.
     */
    @property({ 
        type: [Prefab],
        tooltip: 'Prefabs for regular game items that can be placed in the grid'
    })
    public itemPrefabs: Prefab[] = [];

    /**
     * The prefabs for the game drops.
     */
    @property({ 
        type: [Prefab],
        tooltip: 'Prefabs for game drops that can be placed in the grid'
    })
    public dropPrefabs: Prefab[] = [];
    
    /**
     * The target node for the game field's UI.
     */
    @property({ 
        type: Node,
        tooltip: 'Container node for the game field UI'
    })
    public targetNode: Node = null;

    /**
     * The nodes that should be scaled to fit the game field's UI.
     */
    @property({ 
        type: [Node],
        tooltip: 'Array of nodes that should be scaled to fit the game field UI'
    })
    public scaleTargets: Node[] = [];

    /**
     * The mask target node for the game field's UI.
     */
    @property({ 
        type: Node,
        tooltip: 'Container node for the game field mask'
    })
    public maskTarget: Node = null;

    /**
     * The padding value for the scale targets.
     */
    @property({ 
        type: CCFloat,
        tooltip: 'Padding value for the scale targets'
    })
    public scaleTargetsPadding: Number = 0;

    /**
     * The paddings for the target node.
     */
    @property({ 
        type: Paddings, 
        visible: true, 
        serializable: true,
        tooltip: 'Padding values for the game field layout'
    })
    public targetPaddings: Paddings = new Paddings();

    /**
     * The paddings for the mask target node.
     */
    @property({ 
        type: Paddings, 
        visible: true, 
        serializable: true,
        tooltip: 'Padding values for the game field mask'
    })
    public maskPaddings: Paddings = new Paddings();

    private _uiService: IUIService = inject(UIService);

    private _stateMachine: GameStateMachine = inject(GameStateMachine);

    /**
     * Initializes the game field component.
     */
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

    /**
     * Updates the game field component.
     * @param dt The time delta since the last update.
     */
    protected async update(dt: number): Promise<void> {
        await this._stateMachine.update();
    }
}