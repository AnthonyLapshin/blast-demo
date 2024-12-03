export interface ITransition<TContext> {
    from: string;
    to: string;
    guardCondition?: (context: TContext) => boolean;
}
