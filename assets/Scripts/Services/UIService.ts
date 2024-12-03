import { _decorator, Node, UITransform, Vec3 } from "cc";
import { injectable } from "../Libs/Injects/decorators/injectable";
import { inject } from "../Libs/Injects/inject";
import { ILevelConfigurationService } from "./ILevelConfiguration";
import { IUIService } from "./IUIService";
import { LevelConfigurationService } from "./LevelConfiguration";
import { Paddings } from "../Game/Base/Paddiings";
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
            
            // var oldPos = target.position;
            // var newdPos = new Vec3(oldPos.x - paddings.left, oldPos.y-paddings.bottom);
            // target.position = newdPos;

            // targetTransform.setContentSize(
            //     pixelWidth + (paddings.right + paddings.left), 
            //     pixelHeight + (paddings.top + paddings.bottom));

            // Calculate the content size with paddings
            const totalWidth = pixelWidth + (paddings ? paddings.right + paddings.left : 0);
            const totalHeight = pixelHeight + (paddings ? paddings.top + paddings.bottom : 0);

            // Set the new size first
            targetTransform.setContentSize(totalWidth, totalHeight);

            // Calculate center position with paddings
            // Move the center to the middle of the screen and adjust for paddings
            const centerX = (paddings ? -paddings.left : 0);
            const centerY = (paddings ? -paddings.bottom : 0);

            // Set the position
            target.position = new Vec3(centerX, centerY, 0);
        }
    }
}