import { IState } from './interfaces/IState';

export abstract class BaseState<TContext> implements IState<TContext> {
    private readonly _name: string;

    constructor(name: string) {
        this._name = name;
    }

    public get name(): string {
        return this._name;
    }

    public async onEnter?(context: TContext): Promise<void>;
    public async onExit?(context: TContext): Promise<void>;
    public async update?(context: TContext): Promise<void>;
}
