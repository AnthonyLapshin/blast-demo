import { Node } from "cc";
import { Paddings } from "../Game/Base/Paddiings";
export interface IUIService {
    resetSize(scaleTargets: Node[], paddings: Paddings):Promise<void>;
}