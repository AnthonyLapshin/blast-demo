import { injectable } from "../Libs/Injects/decorators/injectable";
import { inject } from "../Libs/Injects/inject";
import { ILevelConfigurationService } from "./ILevelConfiguration";
import { LevelConfigurationService } from "./LevelConfiguration";

@injectable()
export class FieldCoordinatesService {
    private readonly _lvlConf: ILevelConfigurationService = inject(LevelConfigurationService);
    private _widthInPixels: number;
    private _heightInPixels: number;
    private readonly offsetX: number;
    private readonly offsetY: number;
    constructor() {
        this._widthInPixels = this._lvlConf.width * this._lvlConf.cellWidth;
        this._heightInPixels = this._lvlConf.height * this._lvlConf.cellHeight;
        this.offsetX = (this._widthInPixels) / 2;
        this.offsetY = (this._heightInPixels) / 2;
    }

    public worldToFieldCoordsinates(worldX: number, worldY: number): { x: number, y: number } {

        // Calculate total grid size
        const totalWidth = this._lvlConf.width * this._lvlConf.cellWidth;
        const totalHeight = this._lvlConf.height * this._lvlConf.cellHeight;

        // Calculate offset to center the entire grid
        const offsetX = totalWidth / 2;
        const offsetY = totalHeight / 2;

        // Convert world coordinates to grid coordinates
        const fieldX = Math.floor((worldX + offsetX) / this._lvlConf.cellWidth);
        const fieldY = Math.floor((worldY + offsetY) / this._lvlConf.cellHeight);
        
        return { x: fieldX, y: fieldY };
    }

    public fieldToWorldCoordsinates(fieldX: number, fieldY: number): { x: number, y: number } {
        // Calculate total grid size
        const totalWidth = this._lvlConf.width * this._lvlConf.cellWidth;
        const totalHeight = this._lvlConf.height * this._lvlConf.cellHeight;

        // Calculate offset to center the entire grid
        const offsetX = totalWidth / 2;
        const offsetY = totalHeight / 2;

        // Convert grid coordinates to world coordinates
        const x = (fieldX - (this._lvlConf.width - 1) / 2) * this._lvlConf.cellWidth;
        const y = (fieldY - (this._lvlConf.height - 1) / 2) * this._lvlConf.cellHeight;
        return { x, y };
    }

    public fieldSpawnToWorldCoordsinates(fieldX: number, fieldY: number): { x: number, y: number } {
        const coords = this.fieldToWorldCoordsinates(fieldX, this._lvlConf.height);
        return { x: coords.x, y: coords.y + this._lvlConf.cellHeight * 2 };
    }
        
}