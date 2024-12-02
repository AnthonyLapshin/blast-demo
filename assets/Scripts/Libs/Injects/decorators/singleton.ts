import {injectable} from "./injectable";
import {classMap} from "../dependency-injection";
import {Constructor} from "../type/Type";

/**
 * Class decorator factory that registers the class as a singleton within
 * the global container.
 *
 * @return {Function} The class decorator
 */
export function singleton<T>(): (target: Constructor<T>) => void {
    return function (target: Constructor<T>): void {
        injectable()(target);
        classMap.get(target).asSingleton();
    };
}
