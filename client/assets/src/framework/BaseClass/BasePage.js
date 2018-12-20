// BasePage
// 界面的基类
cc.Class({
    extends: cc.Component,
    onEnter: function () {
        this._initBackEvent();
        this.onInstace();
        this.initPageAnimation();
    },
    onInstace: function () {
        cc.log(`[page]instanced: ${this.__classname__}`);
    },
    onDestroy: function () {
        this._removeBackEvent();
        XMQ.view.closeUniquePage(this.__classname__);
        cc.log(`[page]destroyed: ${this.__classname__}`);
    },
    // 给界面预留的传参接口
    // setParam: function (...arg) {
    // },

    // 给界面预留的二次打开时刷新界面接口(传参与setParam相同)
    // updatePage: function (...arg) {
    // },

    // 给界面预留的返回键接口
    // onPageBack: function () {
    // },

    /**
     * 添加界面入场退场动画 并播放入场动画
     * 子类如果不要动画，则在子类添加:
     *   initPageAnimation() {
     *   }
     * 子类如果有自定义动画，则在子类添加:
     *   initPageAnimation() {
     *      this._super(pathIn, pathOut)
     *   }
     */
    initPageAnimation(pathIn, pathOut){
        // this._rewriteDestroy();
        // this.node.addComponent(cc.Animation);
        // this._loadAniChip = this.node.getComponent(cc.Animation);
        // this._loadAniChip.clearPage = ()=>{
        //     this.node._destroy_();
        // }
        // cc.loader.loadRes(pathOut || "common/ani/pageOut", cc.AnimationClip, (err,animationChip)=>{
        //     this._loadAniChip.addClip(animationChip)
        // });
        // cc.loader.loadRes(pathIn || "common/ani/pageIn" ,cc.AnimationClip, (err,animationChip)=>{
        //     this.node.active = true; //防抖动 加载完成显示
        //     this._loadAniChip.addClip(animationChip)
        //     this._palyPageIn();
        // });
        // this.node.active = false;
    },

    _rewriteDestroy() {
        // this.node._destroy_ = this.node.destroy;
        // this.node.destroy = () => {
        //     this._playPageOut();
        // }
    },
    _palyPageIn(){
        // this._loadAniChip.play("pageIn");
    },
    _playPageOut(){
        // if (cc.js.checkBool(this._isOuting)) {
        //     return;
        // }
        // this._isOuting = true;
        // this._loadAniChip.play("pageOut");
    },

    // 当有返回键接口时，注册该事件
    _initBackEvent: function () {
        // if (this.onPageBack) {
        //     dispatchNodeEvent(XMQ.LobbyEnum.GLOBAL_EVENT.ADD_KEY_BACK, {
        //         who: this.__classname__,
        //         fun: this.onPageBack.bind(this),
        //     })
        // }
    },
    _removeBackEvent: function () {
        // if (this.onPageBack) {
        //     dispatchNodeEvent(XMQ.LobbyEnum.GLOBAL_EVENT.OFF_KEY_BACK, this.__classname__)
        // }
    },
});

/*
var PanelAnimation = cc.Enum({
    None: -1,
    ScaleAndAlpha: -1
});

cc.Class({
    extends: cc.Component,
    properties: {
        showAnimation: {
            default: PanelAnimation.None,
            type: PanelAnimation
        },
        hideAnimation: {
            default: PanelAnimation.None,
            type: PanelAnimation
        },
        isUseMask: false
    },

    onLoad: function() {
        // node load --
        this.nodeDict = {};

        var linkWidget = function(self, nodeDict) {
            var children = self.children;
            for (var i = 0; i < children.length; i++) {
                var widgetName = children[i].name;
                if (widgetName && widgetName.indexOf("key_") >= 0) {
                    var nodeName = widgetName.substring(4);
                    if (nodeDict[nodeName]) {
                        cc.error("控件名字重复!" + children[i].name);
                    }
                    nodeDict[nodeName] = children[i];
                }
                if (children[i].childrenCount > 0) {
                    linkWidget(children[i], nodeDict);
                }
            }
        }.bind(this);
        linkWidget(this.node, this.nodeDict);

        // 添加动画--
        if (!this.showAnimation || !this.hideAnimation) {
            this.anim = this.getComponent(cc.Animation);
            if (!this.anim) {
                this.anim = this.addComponent(cc.Animation);
            }
            this.anim.on('finished', this.showCompleted, this);
        }
    },

    show: function() {
        if (this.showAnimation === PanelAnimation.None) {
            this.node.active = true;
        } else {
            var clipName = PanelAnimation[this.showAnimation];
            this.anim.addClip(dataFunc.uiPanelAnimationClips[clipName]);
            this.anim.play(clipName);
        }
    },

    showCompleted: function() {
        console.log(this.node.name + "动画播放完毕～");
    },

    hide: function() {
        if (this.hideAnimation === PanelAnimation.None) {
            this.node.active = false;
        } else {
            var clipName = PanelAnimation[this.hideAnimation];
            this.anim.addClip(dataFunc.uiPanelAnimationClips[clipName]);
            this.anim.play(clipName);
        }
        // 解除事件绑定--
        clientEvent.clear(this);
    },

    onDestroy: function() {
        if (this.anim) {
            this.anim.off('finished', this.showCompleted, this);
        }
    },
});
/*
window.uiFunc = {
    uiList: [],
    cacheUIList: []
};

uiFunc.openUI = function(uiName, callBack) {
    // 缓存--
    for (var i = 0; i < uiFunc.cacheUIList.length; i++) {
        var temp = uiFunc.cacheUIList[i];
        if (temp && temp.name === uiName) {
            temp.active = true;
            temp.parent = cc.Canvas.instance.node;
            uiFunc.uiList.push(temp)
            uiFunc.cacheUIList.splice(i, 1);

            var panel = temp.getComponent("uiPanel");
            if (panel) {
                panel.show();
            }

            // event--
            if (callBack) {
                callBack(temp);
            }
            clientEvent.dispatch(clientEvent.eventType.openUI);
            return;
        }
    }
    // 非缓存--
    cc.loader.loadRes('ui/' + uiName, function(err, prefab) {
        if (err) {
            cc.error(err.message || err);
            return;
        }

        var temp = cc.instantiate(prefab);
        temp.parent = cc.Canvas.instance.node;
        uiFunc.uiList.push(temp)

        var panel = temp.getComponent("uiPanel");
        if (panel) {
            panel.show();
        }

        // event--
        if (callBack) {
            callBack(temp);
        }
        clientEvent.dispatch(clientEvent.eventType.openUI);
    });
};

uiFunc.closeUI = function(uiName, callBack) {
    for (var i = uiFunc.uiList.length - 1; i >= 0; i--) {
        var temp = uiFunc.uiList[i];
        if (temp && temp.name === uiName) {
            temp.active = false;
            temp.removeFromParent(true);
            uiFunc.cacheUIList.push(temp);
            uiFunc.uiList.splice(i, 1);

            var panel = temp.getComponent("uiPanel");
            if (panel) {
                panel.hide();
            }

            clientEvent.dispatch(clientEvent.eventType.closeUI);
            if (callBack) {
                callBack();
            }
            return;
        }
    }
}

uiFunc.findUI = function(uiName) {
    for (var i = uiFunc.uiList.length - 1; i >= 0; i--) {
        var temp = uiFunc.uiList[i];
        if (temp && temp.name === uiName) {
            return temp;
        }
    }
}

*/