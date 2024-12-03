import { IState } from './interfaces/IState';

export abstract class BaseState<TContext> implements IState<TContext> {
    public readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    public onEnter?(context: TContext): void;
    public onExit?(context: TContext): void;
    public update?(context: TContext): void;
}
