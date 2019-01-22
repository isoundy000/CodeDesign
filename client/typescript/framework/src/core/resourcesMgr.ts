import { Util } from "../tools/utils";

/**
 * 资源管理，或资源预下载操作
 * 主要针对resources目录下的资源
 */
interface NodeRes{
    name:string;
    node:cc.Node;
};
class resMgr{
    private static _instance:resMgr = null;
    private _loadList:Array<string> = new Array<string>();
    private _nodeMap:Array<NodeRes> = new Array<NodeRes>();

    public static getInstance():resMgr{
        if (resMgr._instance === null)
            resMgr._instance = new resMgr();

        return resMgr._instance;
    };
    
    public preload(list:Array<string>,cb?:(resData:Array<any>)=>void,isWait:boolean=false):void{
        if (Util.isInvalid(list) || list.length < 1){
            cb && cb(null);
            return ;
        }

        // 打开遮罩窗口
        if (isWait){
        }
        let self = this;
        let _first = list[0];
        let _resArr = [];
        let _isLoad = false;
        let _hander = setInterval(()=>{
            if (list.length > 0){
                if (_isLoad) return ;
                _isLoad = true;
                cc.loader.loadRes(_first,(error: Error, resource: any)=>{
                    if (error !== null){
                        cc.loader.loadResDir(_first,(error: Error, resource: any[], urls: string[])=>{
                            if (error !== null)
                                throw new Error(error.message);

                            for (let res in resource)
                                _resArr.push(res);
                            self._loadList.push(_first);
                            _first = list.shift();
                            _isLoad = false;
                        });
                    } else {
                        _resArr.push(resource);
                        self._loadList.push(_first);
                        _first = list.shift();
                        _isLoad = false;
                    }
                    list.forEach((it:string)=>{});
                });
            }else{
                clearInterval(_hander);
                _hander = undefined;
                // 关闭遮罩窗口
                cb && cb(_resArr);
            }
        },200);
    };

    public unload(list:Array<string>,isFile:boolean=true):void{
        if (Util.isInvalid(list) || list.length < 1 || this._loadList.length < 1)
            return ;

        let self = this;
        list.forEach((name:string)=>{
            self._loadList.forEach((path:string,index:number)=>{
                if (self._loadList.indexOf(name) !== -1 || path.indexOf(name) !== -1){
                    cc.loader.releaseRes(name);
                    delete self._loadList[index];
                }
            });
        });
    };
    
    public backgroundLoad(files:Array<string>):void{
        this.preload(files);
    };

    public getRes(name:string,cb?:(data:any)=>void,isWait:boolean=false):void{
        this.preload([name],(datas:any[])=>{
            cb && cb(datas[0]);
        },isWait);
    };

    public showOrHideRes(isShow:boolean,obj:string|cc.Prefab|cc.Node|cc.Component,parent?:cc.Node){
        let _toNode = (o)=>{
            if (o instanceof  cc.Node)
                return o;
            else if (o instanceof  cc.Component)
                return o.node;
            else if (o instanceof cc.Prefab)
                return cc.instantiate(o);
            return null;
        };

        if (isShow === false){
            let _tmpNode = _toNode(obj);
            if (Util.isValid(_tmpNode))
                _tmpNode.removeFromParent(false);
            return ;
        }

        let _showNode = (node)=>{
            if (Util.isInvalid((node)))
                return ;

            // 确保节点在显示之前正常初始化
            node.active = true;
            if (node.parent === null){
                parent = parent || cc.director.getScene();
                parent.addChild(node);
            }
        };

        if (typeof obj === 'string'){
            this.preload([obj],(res:any[])=>{
                if (res.length === 1){
                    let _tmp = _toNode(res[0]);
                    if (Util.isValid(_tmp)){
                        _showNode(_tmp);
                        this._nodeMap.push({name:obj,node:_tmp});
                    }
                }
            });
        } else
            _showNode(_toNode(obj));
    };

    public enterScene(sceneCfg:{name:'',bgMusic:''},enterCallFun?:(sceneName?:string,bgMusic?:string)=>void):void{
        if (Util.isValid(sceneCfg)){
            cc.director.loadScene(sceneCfg.name,(err:Error,res)=>{
                if (err !== null)
                    throw new Error('[enter scene '+sceneCfg.name+' error]:'+err.message);
        
                let _scene = res.scene || res;
                if (_scene !== null){
                    if (Util.isEmptyStr(sceneCfg.bgMusic))
                        cc.log('close bg music.');
                    else
                        cc.log('play bg music.');
    
                    enterCallFun = enterCallFun || function (name:string,music:string){cc.log('enter scene:'+name+'.play bg music:'+music);};
                    enterCallFun(sceneCfg.name,sceneCfg.bgMusic);
                }
            });
        } else
            throw new Error('target scene info is error.');

    };
};
export const ResMsg:resMgr = resMgr.getInstance();