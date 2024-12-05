/**
 * @file Type.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-02
 */

export type DynamicObject = Partial<Dynamic>;

export interface Dynamic {
    [key: string]: any;
}

//TODO: try to exclude constructor from abstract class generic
export type Abstract<T> = Exclude<Function & { prototype: T }, Constructor<T>>;
// export type Abstract<T> = Function & { prototype: T };
export type Constructor<T = any> = new (...args: any[]) => T;
export type Class<T> = Abstract<T> | Constructor<T>;
