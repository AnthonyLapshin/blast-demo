import {InjectionMapping, KernelClassesMap} from "./InjectionMapping";
import {IInjectable} from "./interfaces/IInjectable";
import {Class} from "./type/Type";
import {Dictionary} from "./shared/Dictionary";

export const classMap: KernelClassesMap = new Dictionary<Class<IInjectable>, InjectionMapping<IInjectable>>();