import { _decorator, Animation, CCInteger, Component, instantiate, math, Node, Prefab, random, UITransform, Vec2, Vec3 } from "cc";
import GameFieldConfiguration from '../../Configuration/GameFieldConfiguration';
import { Inject } from '../Libs/DI/Decorators';
const { ccclass, property } = _decorator;

@ccclass('GameField')
export class GameField extends Component {

    @property({ type: [Prefab] })
    public itemPrefabs: Prefab[] = [];
    
    private gfConf = GameFieldConfiguration.GameFieldConfiguration;

    private _items: Node[][] = [];

    public get width(): number {
        return this._configuration.width;
    }

    public get height(): number {
        return this._configuration.height;
    }

    public get cellSize(): number {
        return this._configuration.cellSize;
    }

    public get items(): Node[][] {
        return this._items;
    }

    public set items(items: Node[][]) {
        this._items = items;
    }

    private getRandomItem<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    protected start(): void {
        // Set initial content size
        const transform = this.node.getComponent(UITransform);
        const gfConf = GameFieldConfiguration.GameFieldConfiguration;
        const pixelWidth = this.gfConf.width * this.gfConf.cellWidth;
        const pixelHeight = this.gfConf.height * this.gfConf.cellHeight;

        transform.setContentSize(pixelWidth, pixelHeight);
        
        // Calculate scale to fit screen with padding
     
        for (let i = 0; i < gfConf.width; i++) {
            this._items[i] = [];
            for (let j = 0; j < gfConf.height; j++) {
                const item = instantiate((this.getRandomItem(this.itemPrefabs)));
                item.setPosition(i * this.gfConf.cellWidth, j * this.gfConf.cellHeight);
                this.node.addChild(item);
                this._items[i][j] = item;
            }
        }
        
        var adjustmentHeight = this.gfConf.cellHeight %2 == 0? 0 : this.gfConf.cellHeight;
        var adjustmentWidth = this.gfConf.cellWidth %2 == 0? 0 : this.gfConf.cellWidth;
        

        // Center the node
        this.node.setPosition(
            -(transform.width * transform.node.scale.x - adjustmentWidth/2) / 2,
            -(transform.height * transform.node.scale.y - adjustmentHeight/2) / 2
        );
    }

    public addItem(item: Node, x: number, y: number): void {
        this._items[x][y] = item;
    }

    public getItem(x: number, y: number): Node | undefined {
        return this._items[x]?.[y];
    }

    public setItem(x: number, y: number, value: Node): void {
        if (!this._items[x]) {
            this._items[x] = [];
        }
        this._items[x][y] = value;
        value.setPosition(x * this.gfConf.cellWidth, y * this.gfConf.cellHeight);
        this.node.addChild(value);
    }

    public test() {
        console.log(this._items);
        for (let i = 0; i < this._items.length; i++) {
            for (let j = 0; j < this._items[i].length; j++) {
                const k = Math.floor(Math.random() * this._items[i].length);
                [this._items[i][j], this._items[i][k]] = [this._items[i][k], this._items[i][j]];
            }
        }
        for (let i = 0; i < this._items.length; i++) {
            const k = Math.floor(Math.random() * this._items.length);
            [this._items[i], this._items[k]] = [this._items[k], this._items[i]];
        }

        for (let i = 0; i < this._items.length; i++) {
            for (let j = 0; j < this._items[i].length; j++) {
                var item = this._items[i][j];
                item.getComponent('GameFieldItem').moveToPosition(i * this.gfConf.cellWidth, j * this.gfConf.cellHeight);
            }
        }
    }
}