// event
// 事件

cc.Class({
    extends: cc.Component,

    properties: {
    },

    addClickEvent:function(node,target,component,handler){
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },
    
    addSlideEvent:function(node,target,component,handler){
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var slideEvents = node.getComponent(cc.Slider).slideEvents;
        slideEvents.push(eventHandler);
    },

    addEscEvent:function(node){
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
            },
            onKeyReleased: function(keyCode, event){
                if(keyCode == cc.KEY.back){
                    H2O.alert.show('提示','确定要退出游戏吗？',function(){
                        cc.game.end();
                    },true);
                }
            }
        }, node);
    },
    setFitSreenMode:function(){
        var node = cc.find('Canvas');
        var size = cc.view.getFrameSize();
        var w = size.width;
        var h = size.height;
    
        var cvs = node.getComponent(cc.Canvas);
        var dw = cvs.designResolution.width;
        var dh = cvs.designResolution.height;
        //如果更宽 则让高显示满
        if((w / h)  > (dw / dh)){
            cvs.fitHeight = true;
            cvs.fitWidth = false;
        }
        else{
            //如果更高，则让宽显示满
            cvs.fitHeight = false;
            cvs.fitWidth = true;
        }
    }，
    /*
    * 让按钮多少时间后点击生效
    */
    letButtonSafe:function (node,time) {
        let button = node.getComponent(cc.Button);
        if (!button){
            return;
        }
        node.__clickEvents = button.clickEvents;
        node.__safeTime = time || 0.5;
        node.__button = button;
        node.__bClick = false;
        node.on('click', ()=>{
            if(node.__bClick)return;
            node.__bClick = true;
            node.__button.clickEvents = [];
            let del = cc.delayTime(node.__safeTime);
            let cal = cc.callFunc((dt)=>{
                node.__bClick = false;
                node.__button.clickEvents = node.__clickEvents;
            });
            let seq = cc.sequence(del, cal);
            node.runAction(seq);
        }, node);
    },
    // NodeEvent
    // 负责所有节点事件的注册和发送
    // 整个游戏统一使用这一个
    /**
     * @param message
     * @param callback
     * @param target
     * @param useCapture
     */
    addNodeEventListener:function (message, callback, target, useCapture) {
        cc.director.on(message, callback, target, useCapture)
    },
    /**
     * @param message
     * @param detail
     */
    dispatchNodeEvent:function (message, detail) {
        cc.director.emit(message, detail)
    },

    /**
     * 震动 先弄个web版本
     * 隔多少秒停止震动
     * startDelayVibrate(3);
     * 震动多少秒
     * startVibrate(3);
     * 停止震动
     * stopVibrate();
     * 停止场景抖动
     * stopSceneVibrate();
     * 开始场景抖动
     * startSceneVibrate();
     * 隔多少秒停止场景抖动
     * startSceneDelayVibrate();
     * 做场景和抖动动作同时执行
     * doSceneDelayVibrate();
     */
    vibrateInterval : null,
    vibrateSceneInterval : null,
    startVibrate:function(duration) {
        if (!cc.sys.isNative) {
            navigator.vibrate(duration*1000);
            return
        }
        if (cc.sys.os === cc.sys.OS_ANDROID) {
        } else if (cc.sys.os === cc.sys.OS_IOS) {
        }
    },
    stopVibrate:function() {
        if (!cc.sys.isNative) {
            if(this.vibrateInterval) clearInterval(this.vibrateInterval);
            navigator.vibrate(0);
            return
        }
        if (cc.sys.os === cc.sys.OS_ANDROID) {
        } else if (cc.sys.os === cc.sys.OS_IOS) {
        }
    },
    startDelayVibrate:function(duration) {
        if (!cc.sys.isNative) {
            var supportsVibrate = "vibrate" in navigator;
            if(supportsVibrate){
                this.startVibrate(duration);
                this.vibrateInterval = setInterval(()=>{
                    this.stopVibrate();
                }, duration*1000);
            }
            return
        }
        if (cc.sys.os === cc.sys.OS_ANDROID) {
        } else if (cc.sys.os === cc.sys.OS_IOS) {
        }
    },
    startSceneDelayVibrate:function(duration){
        this.startSceneVibrate();
        this.vibrateSceneInterval = setInterval(()=>{
            this.stopSceneVibrate();
        }, duration*1000);
    },
    stopSceneVibrate:function(){
        if(this.vibrateSceneInterval) clearInterval(this.vibrateSceneInterval);
        let node = H2O.persistNode;
        node.stopAllActions();
        let sceneNode = cc.director.getScene();
        sceneNode.x = 0;
        sceneNode.y = 0;
    },
    startSceneVibrate:function(){
        let sceneNode = cc.director.getScene();
        let min = -20;
        let max = 20;
        let callBack = function(){
            let randomX = Math.randomInt(min,max);
            let randomY = Math.randomInt(min,max);
            sceneNode.x = randomX;
            sceneNode.y = randomY;
        }
        let node = H2O.persistNode;
        let del = cc.delayTime(1/30);
        let cal = cc.callFunc(callBack);
        let seq = cc.sequence(del, cal);
        node.runAction(cc.repeatForever(seq));
    },
    doSceneDelayVibrate:function(duration){
        this.startDelayVibrate(duration);
        this.startSceneDelayVibrate(duration);
    },

    /**
     * 自己以及所有子节点的精灵变灰
     * @param node
     * @param bol
     */
    setNodeGray:function(node, bol) {
        this._setOneNodeGray(node, bol);
        let children = node.children;
        for (let i = 0; i < children.length; i++) {
            this._setOneNodeGray(children[i], bol)
        }
    },
    /*
    * 让按钮变灰
    */
    setButtonGray:function(btn, bol) {
        btn.interactable = bol;
        this.setNodeGray(btn.node, bol);
    },
    _setOneNodeGray:function(node, bol) {
        let sp = node.getComponent(cc.Sprite);
        if (sp) {
            sp.setState(bol ? 0 : 1);
        }
    },
    /**
     * 主动让自己的所有子节点有Widget的立刻执行对齐操作
     * @param node
     */
    updateAllWidget:function(node) {
        let children = node.children;
        for (let i = 0; i < children.length; i++) {
            let wgt = children[i].getComponent(cc.Widget);
            if (wgt) {
                wgt.updateAlignment();
            }
        }
    },

});
