import { GameFieldItem } from "../../../GameField/GameFieldItem";
import { inject } from "../../../Libs/Injects/inject";
import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { ILevelConfigurationService } from "../../../Services/ILevelConfiguration";
import { LevelConfigurationService } from "../../../Services/LevelConfiguration";
import { GameTool } from "../../EnumGameTool";
import { GameContext } from "../GameContext";

export class GameBombActivation extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'GameBombActivation'
    private readonly _lvlConf: ILevelConfigurationService = inject(LevelConfigurationService);
    constructor() {
        super(GameBombActivation.STATE_NAME);
    }

    public async onEnter(context: GameContext): Promise<void> {
        console.log(`[GameState] Entering ${GameBombActivation.STATE_NAME}`);
        const selectedItem = context.selectedItem;
        if (!selectedItem) {
            console.error('No item selected for bomb activation');
            return;
        }

        const items = context.items;
        const bombRadius = this._lvlConf.bombRadius[context.currentTool];

        const cluster: GameFieldItem[] = [];

        for (let i = -bombRadius; i <= bombRadius; i++) {
            for (let j = -bombRadius; j <= bombRadius; j++) {
                const x = selectedItem.position.x + i;
                const y = selectedItem.position.y + j;
                
                if (x >= 0 && x < items.length && y >= 0 && y < items[0].length) {
                    const item = items[x][y];
                    if (item) {
                        cluster.push(item);
                    }
                }
            }
        }

        context.currentCluster = cluster;
        console.log(`Bomb activated: Selected ${cluster.length} items`);
    }

    public async onExit(context: GameContext): Promise<void> {
        console.log(`[GameState] Exiting ${GameBombActivation.STATE_NAME}`);
    }
}