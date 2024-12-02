import {IGuard} from "../interfaces/IGuard";
import {IMapping} from "../interfaces/IMapping";

export class Mapping implements IMapping {
    private guards: IGuard[] = [];
    private executeOnce: boolean = false;

    isOnce(): boolean {
        return this.executeOnce;
    }

    once(): IMapping {
        this.executeOnce = true;
        return this;
    }

    withGuards(...guards: any[]): IMapping {
        Array.prototype.push.apply(this.guards, guards);
        return this;
    }

    executionAllowedByGuards(data?: any): boolean {

        for (const guard of this.guards) {
            if (!guard(data)) {
                return false;
            }
        }

        return true;
    }

    createFilter(filterFields?: Object & { [key: string]: any }): Object {
        if (!filterFields) {
            return {};
        }
        const result: { [key: string]: any } = {};
        const propertiesInMapping: string[] = Mapping.extractAllProperties(this);
        for (const property of propertiesInMapping) {
            if (property in filterFields && typeof (this as any)[property] === typeof filterFields[property]) {
                result[property] = filterFields[property];
            }
        }
        return result;

    }

    static extractAllProperties(mapping: IMapping): string[] {
        const result: string[] = [];

        for (const key in mapping) {
            if (mapping.hasOwnProperty(key) && key !== "guards" && key !== "executeOnce") {
                result.push(key);
            }
        }
        return result;
    }

}
