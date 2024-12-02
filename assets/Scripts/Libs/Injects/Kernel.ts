import {InjectionMapping} from "./InjectionMapping";
import {IInjectable} from "./interfaces/IInjectable";
import {classMap} from "./dependency-injection";
import {Class} from "./type/Type";

export class Kernel
{
/*
    private eventMap: EventActionMap;
    private viewMap: ViewMap;
    private mediatorMap: MediatorMap;

    constructor(eventMap: EventActionMap, mediatorMap: MediatorMap, viewMap: ViewMap) {
        this.eventMap = eventMap;
        this.mediatorMap = mediatorMap;
        this.viewMap = viewMap;
    }

    public bindEvent(eventName: string): EventActionMap {
        return this.eventMap.bindEvent(eventName);
    }

    public unBindEvent(eventName: string): EventActionMap {
        return this.eventMap.unBindEvent(eventName);
    }

    public unBindAllActionsFromEvent(eventName: string): void {
        return this.eventMap.unBindAllActionsFromEvent(eventName);
    }

    public bindView(view: Constructor<IView>): ViewMap {
        return this.viewMap.bindView(view);
    }

    public bindMediator(mediator: Constructor<IMediator>): MediatorMap {
        return this.mediatorMap.bindMediator(mediator);
    }
*/
    public bind<T extends IInjectable>(constructor: Class<T>): InjectionMapping<T> {

        let result: InjectionMapping<T> = this.getBinding(constructor);
        if (!result) {
            result = new InjectionMapping(classMap, constructor);
        }

        return result;
    }

    public get<K extends T, T extends IInjectable>(constructor: Class<T>): K {
        const mapping: InjectionMapping<IInjectable> = classMap.get(constructor);

        if (!mapping) {
            throw new Error("There is no any binding for " + constructor + " please bind the class before inject()");
        }

        return mapping.getInstance() as K;
    }

    public getBinding<T extends IInjectable>(constructor: Class<T>): InjectionMapping<T> {
        if (!constructor) {
            throw Error("you are trying to get undefined constructor");
        }

        return <InjectionMapping<T>>classMap.get(constructor);
    }

    public activate(): void {
        const injectionsList: InjectionMapping<IInjectable>[] = [];
        classMap.forEach(item => injectionsList.push(item));

        //Then activate
        injectionsList.forEach(
            (item: InjectionMapping<IInjectable>) => {
                if (item.isForceCreation()) {
                    item.getInstance();
                }
            }
        );
    }
/*
    public activateEventMap(): void {
        this.eventMap.activate();
    }
 */
}
