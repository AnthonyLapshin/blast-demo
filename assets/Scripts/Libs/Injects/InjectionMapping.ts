/**
 * @file InjectionMapping.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-02
 */

import {IInjectable} from "./interfaces/IInjectable";
import {Class, Constructor} from "./type/Type";
import {Dictionary} from "./shared/Dictionary";
import {Mapping} from "./shared/Mapping";

export type KernelClassesMap = Dictionary<Class<IInjectable>, InjectionMapping<IInjectable>>;

export class InjectionMapping<TBase extends IInjectable, TResult extends TBase = TBase> extends Mapping
{
    private instance: TResult = null;
    private isSingleton: boolean = false;
    protected _instanceResultConstructor: Constructor<TResult> = null;
    private args: any[] = [];

    private _isForceCreation: boolean = false;

    constructor(private classesMap: KernelClassesMap, initialConstructor: Class<TBase>) {
        super();
        this.to(initialConstructor as any);
    }

    getInstance(): TResult {
        if (this.isSingleton) {
            if (!this.instance) {
                this.instance = this.createInstance();
                // if (__DEV__) {
                //     // Development tool for create a global link to the class
                //     DebugUtils.mapObjectToGlobalId(this.instance, this.instance.constructor.name, "s");
                // }
            }
            return this.instance;
        }
        return this.createInstance();
    }

    createInstance(): TResult {
        const constructor = this.getConstructor();
        return new constructor(...this.args);
    }

    getConstructor(): Constructor<TResult> {
        if (this._instanceResultConstructor) {
            return this._instanceResultConstructor;
        }

        throw new Error("Constructor is not bound!");
    }

    hasInstance(): boolean {
        return !!this.instance && this.isSingleton;
    }

    destroyInstance(): void {
        this.instance = null;
    }

    asSingleton(): InjectionMapping<TBase, TResult> {
        this.isSingleton = true;
        return this;
    }

    to<TResultOverride extends TBase>(instanceConstructor: Constructor<TResultOverride>): InjectionMapping<TBase, TResultOverride> {

        if (!instanceConstructor) {
            throw new Error("There is an undefined constructor you are trying bind to.");
        }

        const newThis = this.existentialType<TResultOverride>(this);
        const other = this.classesMap.get(instanceConstructor);
        if (other) {
            console.warn("Constructor already bound " + instanceConstructor.name);
        }
        newThis._instanceResultConstructor = instanceConstructor;
        newThis.instance = null;
        this.classesMap.add(instanceConstructor, this);

        return newThis;
    }

    isForceCreation(): boolean {
        return this._isForceCreation;
    }

    forceCreation(): InjectionMapping<TBase, TResult> {
        this._isForceCreation = true;
        return this;
    }

    protected existentialType<TResultOverride extends TBase>(oldThis: InjectionMapping<TBase, TResult>): InjectionMapping<TBase, TResultOverride> {
        return <InjectionMapping<TBase, TResultOverride>>(oldThis as any);
    }

}
