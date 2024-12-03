import { singleton } from "../Libs/Injects/decorators/singleton";
import { ILevelConfigurationService } from "./ILevelConfiguration";

@singleton()
export class LevelConfigurationService implements ILevelConfigurationService {

    private readonly _width: number = 10;
    private readonly _height: number = 10;
    private readonly _cellWidth: number = 171;
    private readonly _cellHeight: number = 192;
    private readonly _paytable: Record<string, number> = {
        "BlueItem": 10,
        "GreenItem": 20,
        "PurpleItem": 30,
        "RedItem": 40,
        "YellowItem": 50
    };

    public get paytable(): Record<string, number> {
        return this._paytable;
    }
    
    public get width(): number{
        return this._width;
    }

    public get height(): number{
        return this._height;
    }

    public get cellWidth(): number{
        return this._cellWidth;
    }
    public get cellHeight(): number{
        return this._cellHeight;
    }
}