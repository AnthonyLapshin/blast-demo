/**
 * A transition callback
 * @TypeParameter TContext - a state machine context class.
 * @constructor
 */
export type ConditionCallBack<TContext> = (pContext: TContext) => boolean | null;