import {IGuarded} from "./IGuarded";

export interface IMapping extends IGuarded<IMapping> {
    once(): IMapping;

    isOnce(): boolean;

    createFilter(filterFields?: Object): Object;
}
