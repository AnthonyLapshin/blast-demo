/**
 * @file IMapping.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-02
 */

import {IGuarded} from "./IGuarded";

export interface IMapping extends IGuarded<IMapping> {
    once(): IMapping;

    isOnce(): boolean;

    createFilter(filterFields?: Object): Object;
}
