import { _decorator, Component, instantiate, Prefab, UITransform } from "cc";
import { GameFieldConfiguration, GameConfiguration } from '../../Configuration/GameFieldConfiguration';

import { GameFieldItem } from "./GameFieldItem";
import { ClusterSeeker } from "./ClusterSeeker";
const { ccclass, property } = _decorator;

@ccclass('GameField')
export class GameField extends Component {

    private static CLICKED_EVENT: string = 'item-clicked';
    private static FIELD_ITEM_COMPONENT: string = 'GameFieldItem';


    @property({ type: [Prefab] })
    public itemPrefabs: Prefab[] = [];
    
    
    

    private _itemPool: GameFieldItem[] = [];

    private _items: GameFieldItem[][] = [];

    private getRandomItem<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    protected start(): void {
        // Set initial content size
        const transform = this.node.getComponent(UITransform);
        
        const pixelWidth = GameFieldConfiguration.width * GameFieldConfiguration.cellWidth;
        const pixelHeight = GameFieldConfiguration.height * GameFieldConfiguration.cellHeight;

        transform.setContentSize(pixelWidth, pixelHeight);
        
        this.fillGrid();

        var adjustmentHeight = GameFieldConfiguration.cellHeight %2 == 0? 0 : GameFieldConfiguration.cellHeight;
        var adjustmentWidth = GameFieldConfiguration.cellWidth %2 == 0? 0 : GameFieldConfiguration.cellWidth;
        

        // Center the node
        this.node.setPosition(
            -(transform.width * transform.node.scale.x - adjustmentWidth/2) / 2,
            -(transform.height * transform.node.scale.y - adjustmentHeight/2) / 2
        );
    }

    protected fillGrid(): void {
        for (let i = 0; i < GameFieldConfiguration.width; i++) {
            this._items[i] = [];
            for (let j = 0; j < GameFieldConfiguration.height; j++) {
                            
                // Let's add the item to the pool
                const poolItem = instantiate((this.getRandomItem(this.itemPrefabs)));
                var itemForPool = poolItem.getComponent(GameField.FIELD_ITEM_COMPONENT);
                this._itemPool.push(itemForPool);
                this.subscribeClickEvents(itemForPool);

                const item = instantiate((this.getRandomItem(this.itemPrefabs)));
                item.setPosition(i * GameFieldConfiguration.cellWidth, j * GameFieldConfiguration.cellHeight);
                this.node.addChild(item);
                const itemComponent = item.getComponent(GameField.FIELD_ITEM_COMPONENT);
                this._items[i][j] = itemComponent;

                // Listen for click events from items
                this.subscribeClickEvents(itemComponent);
            }
        }
    }

    private subscribeClickEvents(item: GameFieldItem): void {
        item.node.on(GameField.CLICKED_EVENT, (clickedItem: GameFieldItem) => {
            this.onItemClicked(clickedItem);
        });
    }

    private onItemClicked(clickedItem: GameFieldItem): void {
        // Find the position of clicked item in the grid
        for (let i = 0; i < this._items.length; i++) {
            for (let j = 0; j < this._items[i].length; j++) {
                
                if (this._items[i][j] === clickedItem) {
                    console.log(`Clicked item at position [${i}, ${j}] of type ${clickedItem.ItemType}`);
                    const cluster = this.findClusters(GameConfiguration.minClusterSize, i, j, 'ItemType');
                    if (cluster.length > 0) {
                        console.log('Found clusters:', cluster.length);
                        this.removeCluster(cluster);
                    }else{
                        console.log('Clusters not found: ', cluster.length);
                    }
                    return;
                }
            }
        }        
    }

    private removeCluster(cluster: GameFieldItem[]): void {
        // Here we need to implement cluster removal logic
        for (const item of cluster) {
            const index = this._items.findIndex(row => row.includes(item));
            if (index !== -1) {
                const columnIndex = this._items[index].indexOf(item);
                if (columnIndex !== -1) {
                    // Remove the item from the grid
                    this._items[index][columnIndex] = null;
                    // Remove the item from the scene and add to pool
                    item.node.removeFromParent();
                    this._itemPool.push(item);
                }
            }
        }

        // Collapse the grid
        this.collapseGrid();

        // Refill empty spaces
        this.refillGrid();

        var remainClusters = this.findAllClusters(GameConfiguration.minClusterSize, 'ItemType').length;
        if (remainClusters > 0) {
            console.log('Remaining clusters:', remainClusters); 
            return;
        }
        
        for (let i = 0; i < GameConfiguration.reshuffles; i++) {
            this.shuffleItems();
            remainClusters = this.findAllClusters(GameConfiguration.minClusterSize, 'ItemType').length;
            if (remainClusters > 0) {
                break;
            }
        }
    }

    private refillGrid(): void {
        for (let i = 0; i < this._items.length; i++) {
            for (let j = 0; j < this._items[i].length; j++) {
                if (!this._items[i][j]) {
                    const item = this.getRandomItem(this._itemPool);
                    const poolIndex = this._itemPool.indexOf(item);
                    if (poolIndex !== -1) {
                        this._itemPool.splice(poolIndex, 1);
                    }
                    this._items[i][j] = item;
                    // add item on top of the grid (it will be behind the mask)
                    item.node.setPosition(i * GameFieldConfiguration.cellWidth, (GameFieldConfiguration.height + 1) * GameFieldConfiguration.cellHeight);
                    
                    //item.node.setPosition(this.gfConf.w this.gfConf.cellWidth, j * this.gfConf.cellHeight);
                    this.node.addChild(item.node);

                    item.moveToPosition(i * GameFieldConfiguration.cellWidth, j * GameFieldConfiguration.cellHeight, 0.2, (GameFieldConfiguration.height - j) * 0.15);
                }
            }
        }
    }


    //ToDo: make helper function
    public collapseGrid(): void {
        const height = this._items[0].length;
        // Process each column independently
        for (let col = 0; col < this._items.length; col++) {
            // Start checking from bottom
            for (let row = 0; row < height; row++) {
                if (!this._items[col][row]) {
                    // Found an empty spot, look above for items to fall
                    for (let above = row + 1; above < height; above++) {
                        if (this._items[col][above]) {
                            // Move the item down
                            this._items[col][above].moveToPosition(col * GameFieldConfiguration.cellWidth, row * GameFieldConfiguration.cellHeight, 0.2, (above - row) * 0.1);
                            this._items[col][row] = this._items[col][above];
                            this._items[col][above] = null;
                            break;
                        }
                    }
                }
            }
        }
    }


    protected findClusters(minClusterSize: number, startingX: number, startingY: number, propertyName: string): GameFieldItem[] {
        return ClusterSeeker.Instance.CollectCluster(this._items, minClusterSize, startingX, startingY, propertyName);
    }

    public findAllClusters(minClusterSize: number, propertyName: string = 'ItemType'): GameFieldItem[][] {
        return ClusterSeeker.Instance.FindAllClusters(this._items, minClusterSize, propertyName);
    }

    public shuffleItems(): void{
        this._items.shuffle2D();
        this.resetItems();
    }

    // Reset item positions
    public resetItems(): void{
        for (let i = 0; i < this._items.length; i++) {
            for (let j = 0; j < this._items[i].length; j++) {
                var item = this._items[i][j];
                item.moveToPosition(i * GameFieldConfiguration.cellWidth, j * GameFieldConfiguration.cellHeight, 0.2, (GameFieldConfiguration.height - j) * 0.15);
            }
        }
    }
}