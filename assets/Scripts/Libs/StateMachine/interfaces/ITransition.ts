/**
 * @file ITransition.ts
 * @author Anton Lapshin <anton@lapshin.dev>
 * @created 2024-12-04
 */

export interface ITransition<TContext> {
    from: string;
    to: string;
    guardCondition?: (context: TContext) => boolean;
}
