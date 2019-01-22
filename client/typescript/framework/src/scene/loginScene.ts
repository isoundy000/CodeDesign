import { Util, Environment } from "../tools/utils";
import { EventCustom } from "../core/eventCustom";
import { EventMessage } from "../events";
import { Launcher } from "../tools/launcher";
import Config from "../config";
import { ResMsg } from "../core/resourcesMgr";
import SocketListener from "../core/socket/socketListener";
import { Http } from "../core/socket/http";
import { DES } from "../core/thirdlibs/des";
import { User } from "../logic/user";
import LogicBase from "../core/logicBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginScene extends cc.Component {

    @property(cc.Sprite)
    imgLoading: cc.Sprite = null;

    @property(cc.Label)
    lblLoading: cc.Label = null;

    @property(cc.Label)
    lblTitle: cc.Label = null;

    @property(cc.Label)
    lblTips: cc.Label = null;

    @property(cc.Label)
    lblVersion: cc.Label = null;

    @property({tooltip: '系统常驻节点，挂接一些比较特殊的全局事件'})
    permanentNode:cc.Node = null;

    onLoad () {
        cc.debug.setDisplayStats(Config.isDevelop);
        let parent = this.permanentNode;
        parent.zIndex = cc.macro.MAX_ZINDEX;
        cc.game.addPersistRootNode(parent);

        this.lblTips.string = '';
        this.lblTitle.string = '';
        this.imgLoading.node.active=false;
        EventCustom.on('S2GWS_PlayerLogin', (userInfo:Object)=>{
            if (!Util.isInvalid(userInfo)){
                ResMsg.enterScene(Config.Scenes.hallScene,()=>{
                    // 销毁登陆后，后台开启资源预下载
                });
            } else {
                // 登陆失败了
            }
        },this);
    }

    start () {
        Util.getLanguageByKey('');
        let self = this;
        this.scheduleOnce((dt)=>{
            self.lblTitle.string = Util.getLanguageByKey('AppName');
            self.lblTips.string = Util.getLanguageByKey('loadingRes');
            self.imgLoading.node.active=true;
            self.imgLoading.node.runAction(cc.repeatForever(cc.rotateBy(0.1,30)));
        },2);
        if (cc.sys.isBrowser){
            // 预下载大厅场景必须资源
            ResMsg.preload(Config.Scenes.hallScene.preloads,()=>{
                let _data = 'GolangLtdDT?'+encodeURI('Protocol=8&Protocol2=1&login_os='+Util.getRunEnvironment());
                Http.Get(Config.gatwayAdd, _data, (data:any)=>{
                    if (Util.isValid(data)){
                        let _result = JSON.parse(DES.decodeBase64(data));
                        if (Util.isValid(_result)){
                            User.setProperty(0,_result.GateWayST);
                            User.setProperty(1,_result.PlayerST);
                            User.setProperty(2,_result.GameList);
                            User.setProperty(3,_result.BannerList);
                            self.scheduleOnce(self._loginAuth.bind(this),5);
                        }
                    }
                });
            });
        } else if (cc.sys.isNative){
            // 走热更流程
            let _env:Environment = Util.getRunEnvironment();
            if (_env === Environment.ENV_APP_ANDROID){
                // 添加android热更流程
            } else if (_env === Environment.ENV_APP_IOS){
                // 添加ios热更流程
            }
        }
    }

    // update (dt) {}

    // 创建网络链接
    _loginAuth(){
        ResMsg.enterScene(Config.Scenes.hallScene,()=>{
            // 销毁登陆后，后台开启资源预下载
        });
        return ;
        let _info = User.userInfo;
        EventCustom.emit(EventMessage.SEND_MSG_TO_SVR,'C2GWS_PlayerLogin',{
            PlayerUID:_info.uid,
            PlayerName:_info.name,
            HeadUrl:_info.head,
            Constellation:_info.constellation,
            PlayerSchool:_info.school,
            Sex:_info.sex,
            Token:_info.token
        });
    }
}
