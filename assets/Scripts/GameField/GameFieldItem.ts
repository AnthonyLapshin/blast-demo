//import { tween, Tween } from "cc";
import { _decorator, Animation, CCInteger, Component, instantiate, math, Node, Prefab, UITransform, Vec3 , tween} from "cc";
const { ccclass, property } = _decorator;

@ccclass('GameFieldItem')
class GameFieldItem extends Component {
    
    public newPositionX: number = 0;
    public newPositionY: number = 0;

    public moveToPosition(x: number, y: number) {
        this.newPositionX = x;
        this.newPositionY = y;
        tween(this.node)
                .to(0.5, { position: new Vec3(this.newPositionX, this.newPositionY, 0) })
                .start();
    }
    
    public start() {
        
    }
}