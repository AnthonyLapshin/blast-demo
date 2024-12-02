import { Injectable } from "../Scripts/Libs/DI/Decorators";

@Injectable()
export default class LevelConfiguration{
    public static GameFieldConfiguration: any = {
        width: 6,
        height: 6,
        cellWidth:  171,
        cellHeight:  192
    }
}