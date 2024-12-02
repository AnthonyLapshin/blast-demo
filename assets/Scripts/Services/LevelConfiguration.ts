import { singleton } from "../Libs/Injects/decorators/singleton";
import { ILevelConfigurationService } from "./ILevelConfiguration";

@singleton()
export class LevelConfigurationService implements ILevelConfigurationService {

    private  _width: number = 10;
    private  _height: number = 10;
    private  _cellWidth: number = 171;
    private  _cellHeight: number = 192;

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