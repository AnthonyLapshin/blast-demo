import { IStateMachineContext } from "../Interfaces/IStateMachineContext";
import { IBaseStateMachine } from "../Interfaces/IBaseStateMachine";

/**
 * Abstract and basic state machine.
 * @TypeParameter TContext - a state machine context class.
 */
export class AbstractStateMachineContext<TContext, TEvent> implements IStateMachineContext<TContext, TEvent>
{
  protected _stateMachine: IBaseStateMachine<TContext, TEvent>

  constructor(pStateMachine: IBaseStateMachine<TContext, TEvent>)
  {
    this._stateMachine = pStateMachine;
  }

  Reset(): void
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  {

  }

  get StateMachine(): IBaseStateMachine<TContext, TEvent>
  {
    return this._stateMachine;
  }
}