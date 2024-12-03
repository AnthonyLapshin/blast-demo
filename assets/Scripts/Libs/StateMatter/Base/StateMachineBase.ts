import { AbstractBaseStateMachine } from "../Abstract/AbstractBaseStateMachine";
import { IBaseState } from "../Interfaces/IBaseState";
import { AbstractStateMachineContext } from "../Abstract/AbstractStateMachineContext";

/**
 * A base state machine class that implement necessary abstract interface members
 * @TypeParameter TContext - a state machine context class.
 */
export class StateMachineBase<TContext extends AbstractStateMachineContext<unknown, unknown>>
  extends AbstractBaseStateMachine<TContext, unknown>
{
  /**
   * Initialize the new member of the AbstractBaseStateMachine with given context.
   * @param pContext - A state machine context.
   * @param pInitialState - An initial state of the state machine.
   */
  constructor(pContext: TContext | null = null, pInitialState: IBaseState<TContext> | null = null) 
  {
    super(pContext, pInitialState);
  }
}