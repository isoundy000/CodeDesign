import { EventCustom } from "../core/eventCustom";
import { EventMessage } from "../events";
import { Util } from "../tools/utils";
///<reference path='../core/eventCustom.ts'/>
interface PersonalInfo{
    name:string;
    constellation:string;
    head:string;
    school:string;
    token:string;
    uid:number;
    level:number;
    sex:number;
    vip:number;
    Mcards:number;                  // M卡
    coins:number;
    diamonds:number;

};

// 比赛信息
interface MatchInfo{

};

// 背包信息
interface BackpackInfo{

};

// 邮件信息
interface MailInfo{

};

// 登陆信息
interface ServerInfo{
    maxPlayers:number;
    onlinePlayers:number;
    svrID:number;
    svrAdd:string;
    svrName:string;
    svrState:string;
    token:string;
};

class CUser{
    private static _instance:CUser = null;
    private _svrInfo:ServerInfo = null;
    private _baseInfo:PersonalInfo = null;
    private _matchInfo:MatchInfo = null;
    private _backpackInfo:BackpackInfo = null;
    private _mailInfo:MailInfo = null;
    private _gameList:Array<any> = new Array<any>();
    private _bannerList:Array<any> = new Array<any>();

    constructor(){
        this._baseInfo = null;
        this._backpackInfo = null;
        this._matchInfo = null;
        this._mailInfo = null;
        this._initEvent();
    };

    private _initEvent():void{
        let self = this;
        EventCustom.on(EventMessage.UPDATE_USER_INFO,(data:PersonalInfo)=>{
            if (Util.isInvalid(self._baseInfo) || self._baseInfo.name === data.name)
                self._baseInfo = data;
        });

        EventCustom.on(EventMessage.UPDATE_USER_BACKPACK_INFO,(data:BackpackInfo)=>{self._backpackInfo = data});
        EventCustom.on(EventMessage.UPDATE_USER_MATCH_INFO,(data:MatchInfo)=>{self._matchInfo = data});
        EventCustom.on(EventMessage.UPDATE_USER_MAIL_INFO,(data:MailInfo)=>{self._mailInfo = data});
    }

    public static getInstance():CUser{
        if (CUser._instance === null)
            CUser._instance = new CUser();

        return CUser._instance;
    };

    public setProperty(id:number,data:any){
        if (Util.isValid(data))
            data = Util.obj2Json(data);

        switch (id){
            case 0:{ // 网关信息
                Util.mergeObject(this._svrInfo,data);
            }
            break ;
            case 1:{    // 用户信息
                this._baseInfo = data || this._createFakeUser();
                cc.sys.localStorage.setItem('userData',data);
            }
            break ;
            case 2:{    // 游戏列表
                for (let k in data)
                    this._gameList.push(data[k]);
            }
            break ;
            case 3:{    // 公告信息
                for (let k in data)
                    this._bannerList.push(data[k]);
            }
            break;
        }
    };

    // 服务器信息
    public get serverInfo():ServerInfo{
        return this._svrInfo;
    };

    // 用户个人信息
    public get userInfo():PersonalInfo{
        return this._baseInfo;
    }

    // 比赛信息
    public get matchInfo():any{
        return this._matchInfo;
    };

    // 背包信息
    public get backpackInfo():any{
        return this._backpackInfo;
    };

    // 邮件信息
    public get mailInfo():MailInfo{
        return this._mailInfo;
    };

    // 广告信息
    public get bannerInfo():Array<any>{
        return this._bannerList;
    };

    // 游戏列表
    public get gameList():Array<any>{
        return this._gameList;
    };

    // 创建一个假用户
    private _createFakeUser():any{
        let _names = ['球球不是胖子','大冬瓜','小米渣','老洋芋','范童童','汪斌','王锴','小仙女','小手冰凉'];
        let _stars = ['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座'];
        let _schools = ['成都理工大学','四川大学','乐山师范学院','内江师范学院','成都电子科技大学','四川师范大学'];
        let _uid = Math.floor((Math.random()*10000)+99999);
        return {
            PlayerUID: _uid,
            Token: ''+((new Date()).getTime()+_uid),
            PlayerName: _names[Math.floor(Math.random()*(_names.length-1))],
            HeadUrl: 'http://xmqvip1-1253933147.file.myqcloud.com/ugc/images/2018/04/16/152387637868832h.jpg',
            Constellation: _stars[Math.floor(Math.random()*11)],
            PlayerSchool: _schools[Math.floor(Math.random()*5)],
            Sex: Math.floor(Math.random()+1)
        };
    }
};

export const User:CUser = CUser.getInstance();