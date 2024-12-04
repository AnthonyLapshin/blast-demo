import { Node } from "cc";
import { Paddings } from "../UI/Paddiings";
export interface IUIService {
    resetSize(scaleTargets: Node[], paddings: Paddings):Promise<void>;
}