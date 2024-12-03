export interface IState<TContext> {
    name: string;
    onEnter?: (context: TContext) => void;
    onExit?: (context: TContext) => void;
    update?: (context: TContext) => void;
}
