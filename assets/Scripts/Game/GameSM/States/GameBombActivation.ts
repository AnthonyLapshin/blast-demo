/**
 * @file GameBombActivation.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-06
 */

import { GameFieldItem } from "../../../GameField/GameFieldItem";
import { inject } from "../../../Libs/Injects/inject";
import { BaseState } from "../../../Libs/StateMachine/BaseState";
import { ILevelConfigurationService } from "../../../Services/Interfaces/ILevelConfiguration";
import { IPlayerInventoryObserver } from "../../../Services/Interfaces/IPlayerInventoryObserver";
import { IPlayerInventoryService } from "../../../Services/Interfaces/IPlayerInventoryService";
import { LevelConfigurationService } from "../../../Services/LevelConfiguration";
import { PlayerInventoryService } from "../../../Services/PlayerInventoryService";
import { GameTool } from "../../EnumGameTool";
import { GameContext } from "../GameContext";

export class GameBombActivation extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'GameBombActivation'
    private readonly _lvlConf: ILevelConfigurationService = inject(LevelConfigurationService);
    private readonly _inventory: IPlayerInventoryService = inject(PlayerInventoryService);
    constructor() {
        super(GameBombActivation.STATE_NAME);
    }

    public async onEnter(context: GameContext): Promise<void> {
        
        if (this._inventory.getAmount(context.currentTool) <= 0) {
            context.skipMove = true;
            context.currentTool = GameTool.SELECTOR;
            return;
        }

        this._inventory.removeAmount(context.currentTool, 1);

        const selectedItem = context.selectedItem;
        if (!selectedItem) {
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
    }
}