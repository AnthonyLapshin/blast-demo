import { injectable } from "../Libs/Injects/decorators/injectable";
import { inject } from "../Libs/Injects/inject";
import { ILevelConfigurationService } from "./Interfaces/ILevelConfiguration";
import { LevelConfigurationService } from "./LevelConfiguration";

/**
 * Service responsible for handling coordinate transformations and calculations
 * for the game field. This includes converting between grid positions and
 * world coordinates.
 */
@injectable()
export class FieldCoordinatesService {
    private readonly _lvlConf: ILevelConfigurationService = inject(LevelConfigurationService);
    private _widthInPixels: number;
    private _heightInPixels: number;
    private readonly offsetX: number;
    private readonly offsetY: number;

    /**
     * Initializes the field coordinates service with the level configuration.
     */
    constructor() {
        this._widthInPixels = this._lvlConf.width * this._lvlConf.cellWidth;
        this._heightInPixels = this._lvlConf.height * this._lvlConf.cellHeight;
        this.offsetX = (this._widthInPixels) / 2;
        this.offsetY = (this._heightInPixels) / 2;
    }

    /**
     * Converts world coordinates to grid coordinates.
     * @param worldX X-coordinate in world space
     * @param worldY Y-coordinate in world space
     * @returns Grid coordinates
     */
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

    /**
     * Converts grid coordinates to world coordinates.
     * @param fieldX X-coordinate in grid space
     * @param fieldY Y-coordinate in grid space
     * @returns World coordinates
     */
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

    /**
     * Converts grid coordinates to world coordinates for a spawn position.
     * @param fieldX X-coordinate in grid space
     * @param fieldY Y-coordinate in grid space
     * @returns World coordinates for a spawn position
     */
    public fieldSpawnToWorldCoordsinates(fieldX: number, fieldY: number): { x: number, y: number } {
        const coords = this.fieldToWorldCoordsinates(fieldX, this._lvlConf.height);
        return { x: coords.x, y: coords.y + this._lvlConf.cellHeight * 2 };
    }
        
}