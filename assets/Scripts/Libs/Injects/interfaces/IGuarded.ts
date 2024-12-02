import {IGuard} from "./IGuard";

export interface IGuarded<T> {
    withGuards(...guards: IGuard[]): T;

    executionAllowedByGuards(eventData?: any): boolean;
}
