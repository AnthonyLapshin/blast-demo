import {AbstractBaseState} from "../Abstract/AbstractBaseState";
import {TerminableContext} from "./TerminableContext";

export class BaseTerminableState<TContext extends TerminableContext<any, any>> extends AbstractBaseState<TContext>
{
    BeforeEnter(): void
    {
    }

    public BeforeExit()
    {
    }

    Terminate(): void
    {
    }
}