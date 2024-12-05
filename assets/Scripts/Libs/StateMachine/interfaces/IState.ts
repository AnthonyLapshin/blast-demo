/**
 * @file IState.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-04
 */

export interface IState<TContext> {
    name: string;
    onEnter?: (context: TContext) => Promise<void>;
    onExit?: (context: TContext) => Promise<void>;
    update?: (context: TContext) => Promise<void>;
}
