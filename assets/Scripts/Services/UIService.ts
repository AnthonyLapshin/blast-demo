import { _decorator, Node, UITransform, Vec3 } from "cc";
import { injectable } from "../Libs/Injects/decorators/injectable";
import { inject } from "../Libs/Injects/inject";
import { ILevelConfigurationService } from "./ILevelConfiguration";
import { IUIService } from "./IUIService";
import { LevelConfigurationService } from "./LevelConfiguration";
import { Paddings } from "../UI/Paddiings";
const { ccclass, property } = _decorator;

@injectable()
@ccclass('UIService')
export class UIService implements IUIService {
    private lvlConf: ILevelConfigurationService = inject(LevelConfigurationService);

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