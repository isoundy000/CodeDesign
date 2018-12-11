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
                    JYL.alert.show('提示','确定要退出游戏吗？',function(){
                        cc.game.end();
                    },true);
                }
            }
        }, node);
    },

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
    
    // // NodeEvent
    // // 负责所有节点事件的注册和发送
    // // 整个游戏统一使用这一个
    // /**
    //  * @param message
    //  * @param callback
    //  * @param target
    //  * @param useCapture
    //  */
    // window.addNodeEventListener = function (message, callback, target, useCapture) {
    //     cc.director.on(message, callback, target, useCapture)
    // };
    // /**
    //  * @param message
    //  * @param detail
    //  */
    // window.dispatchNodeEvent = function (message, detail) {
    //     cc.director.emit(message, detail)
    // };
});
