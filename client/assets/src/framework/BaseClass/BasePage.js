// BasePage
// 界面的基类
var PageAnimation = cc.Enum({
    None: -1,
    ScaleAndAlpha: -1
});
cc.Class({
    extends: cc.Component,
    properties: {
        pageInAnimation: {
            default: PageAnimation.None,
            type: PageAnimation
        },
        pageOutAnimation: {
            default: PageAnimation.None,
            type: PageAnimation
        },
        isUseMask: false
    },
    // 子类onLoad this._super()
    onLoad: function() {
        this.root = {};

        var linkWidget = function(self, root) {
            var children = self.children;
            for (var i = 0; i < children.length; i++) {
                var widgetName = children[i].name;
                if (widgetName && widgetName.indexOf("key_") >= 0) {
                    var nodeName = widgetName.substring(4);
                    if (root[nodeName]) {
                        cc.assert(`[page]linkWidget: ${this.__classname__} component name repeat ${children[i].name}`);
                    }
                    root[nodeName] = children[i];
                }
                if (children[i].childrenCount > 0) {
                    linkWidget(children[i], root);
                }
            }
        }.bind(this);
        linkWidget(this.node, this.root);

        // 添加动画--
        if (!this.pageInAnimation || !this.pageOutAnimation) {
            this.pageAnimation = this.getComponent(cc.Animation);
            if (!this.pageAnimation) {
                this.pageAnimation = this.addComponent(cc.Animation);
            }
            this.pageAnimation.on('finished', this.showCompleted, this);
        }
    },
    statics: {
    },
    __preload: function () {
        if(!CC_EDITOR) {
           cc.log(`[page]preload: ${this.__classname__}`);
        }
    },
    onEnable: function () {
        if(!CC_EDITOR) {
           cc.log(`[page]onEnable: ${this.__classname__}`);
        }
    },
    onDisable: function () {
        if(!CC_EDITOR) {
           cc.log(`[page]onDisable: ${this.__classname__}`);
        }
    },
    onDestroy: function() {
        if (this.pageAnimation) {
            this.pageAnimation.off('finished', this.showCompleted, this);
        }
    },
    showCompleted: function(){
        cc.log(`[page]: ${this.__classname__} - pageAnimation ok`);
    },

    playPageIn: function() {
        if (this.pageInAnimation === PageAnimation.None) {
            this.node.active = true;
        } else {
            var clipName = PageAnimation[this.pageInAnimation];
            this.pageAnimation.addClip(GConfig.PageAnimation[clipName]);
            this.pageAnimation.play(clipName);
        }
    },
    playPageOut: function() {
        if (this.pageOutAnimation === PageAnimation.None) {
            this.node.active = false;
        } else {
            var clipName = PageAnimation[this.pageOutAnimation];
            this.pageAnimation.addClip(GConfig.PageAnimation[clipName]);
            this.pageAnimation.play(clipName);
        }
    },
});