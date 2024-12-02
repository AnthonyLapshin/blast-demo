import {InjectionMapping} from "../InjectionMapping";
import {classMap} from "../dependency-injection";
import {Constructor} from "../type/Type";

export function injectable<T>(): (target: Constructor<T>) => void {
    return function (target: Constructor<T>): void {
        const result: InjectionMapping<T> = <InjectionMapping<T>>classMap.get(target);
        if (!result) {
            new InjectionMapping(classMap, target);
        }
    };
}
