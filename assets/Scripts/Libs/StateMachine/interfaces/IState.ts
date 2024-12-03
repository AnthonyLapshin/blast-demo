export interface IState<TContext> {
    name: string;
    onEnter?: (context: TContext) => Promise<void>;
    onExit?: (context: TContext) => Promise<void>;
    update?: (context: TContext) => Promise<void>;
}
