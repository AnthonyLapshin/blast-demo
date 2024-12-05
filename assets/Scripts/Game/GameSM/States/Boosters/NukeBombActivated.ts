import { GameFieldItem } from "../../../../GameField/GameFieldItem";
import { BaseState } from "../../../../Libs/StateMachine/BaseState";
import { GameContext } from "../../GameContext";

export class NukeBombActivated extends BaseState<GameContext> {
    public static readonly STATE_NAME: string = 'NukeBombActivated';
    constructor() {
        super(NukeBombActivated.STATE_NAME);
    }

    public async onEnter(context: GameContext): Promise<void> {
        console.log(`[GameState] Entering ${NukeBombActivated.STATE_NAME}`);
        const items = context.items;
        const cluster: GameFieldItem[] = [];

        for (let i = 0; i < items.length; i++) {
            for (let j = 0; j < items[i].length; j++) {
                cluster.push(items[i][j]);
            }
        }
        context.currentCluster = cluster;
        console.log(`Nuke Bomb activated: Selected ${cluster.length} items`);
    }
}   