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
        "YellowItem": 50,
        // Boosters
        "COL_ROCKET_1": 60,
        "ROW_ROCKET_1": 60,
        "COL_ROCKET_2": 60,
        "ROW_ROCKET_2": 60,
        "NUKE_BOMB": 100
    };

    private readonly _drops: Record<number, string[]> = {
        6: ["COL_ROCKET_1", "ROW_ROCKET_1"],
        7: ["COL_ROCKET_2", "ROW_ROCKET_2"],
        8: ["NUKE_BOMB"],
    };

    private readonly _maxMoves: number = 15;
    private readonly _targetScore: number = 15500;

    private readonly _bombRadius: Record<string, number> = {
        "BOMB_1": 1,
        "BOMB_2": 2,
    };

    public get drops(): Record<number, string[]> {
        return this._drops;
    }

    public get bombRadius(): Record<string, number> {
        return this._bombRadius;
    }

    public get maxMoves(): number{
        return this._maxMoves;
    }
    
    public get targetScore(): number{
        return this._targetScore;
    }

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