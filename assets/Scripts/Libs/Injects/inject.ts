import {IInjectable} from "./interfaces/IInjectable";
import {Class} from "./type/Type";
import {Kernel} from "./Kernel";

export const kernel = new Kernel();

export function inject<K extends T, T extends IInjectable>(constructor: Class<T>): K {
    return kernel.get(constructor);
}
