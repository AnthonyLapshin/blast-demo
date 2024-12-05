/**
 * @file UIService.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-05
 */

import { _decorator, Node, Prefab, UITransform, Vec3 } from "cc";
import { injectable } from "../Libs/Injects/decorators/injectable";
import { inject } from "../Libs/Injects/inject";
import { ILevelConfigurationService } from "./Interfaces/ILevelConfiguration";
import { IUIService } from "./Interfaces/IUIService";
import { LevelConfigurationService } from "./LevelConfiguration";
import { Paddings } from "../UI/Paddings";
const { ccclass, property } = _decorator;

/**
 * Service responsible for managing UI elements and interactions.
 * This service handles the creation, display, and management of UI components
 * such as windows, popups, and other interface elements.
 */
@injectable()
@ccclass('UIService')
export class UIService implements IUIService {
    private lvlConf: ILevelConfigurationService = inject(LevelConfigurationService);

    /**
     * Resets the size of the given UI elements based on the level configuration and paddings.
     * @param scaleTargets The UI elements to reset the size for
     * @param paddings The paddings to apply to the UI elements
     */
    public async resetSize(scaleTargets: Node[], paddings: Paddings | null): Promise<void> {
        if (!scaleTargets || scaleTargets.length === 0) return;

        const conf = this.lvlConf;
        const pixelWidth = conf.width * conf.cellWidth;
        const pixelHeight = conf.height * conf.cellHeight;

        if (paddings == null) {
            paddings = new Paddings();
        }

        for (let i = 0; i < scaleTargets.length; i++) {
            const target = scaleTargets[i];
            const targetTransform = target.getComponent(UITransform);
            if (targetTransform == null) continue;
            
            const totalWidth = pixelWidth + (paddings ? paddings.right + paddings.left : 0);
            const totalHeight = pixelHeight + (paddings ? paddings.top + paddings.bottom : 0);

            targetTransform.setContentSize(totalWidth, totalHeight);
        }
    }
}