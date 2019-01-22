import { AudioPlay } from "./audio";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ClickAudio extends cc.Component {
    soundName:string = "framework/sound/click.mp3";

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._play.bind(this), this);
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._play.bind(this), this);
    }

    private _play(){ 
        AudioPlay.playAudio(this.soundName);
    }
}
