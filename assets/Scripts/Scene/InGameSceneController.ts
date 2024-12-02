import { _decorator, Component, Node } from 'cc';
import { inject } from '../Libs/Injects/inject';
import { GameConfigurationService } from '../Services/GameConfigurationService';


const { ccclass, property } = _decorator;

@ccclass('InGameSceneController')
export class InGameSceneController extends Component {
   
    start() {

    }

    update(deltaTime: number) {
    }
}
