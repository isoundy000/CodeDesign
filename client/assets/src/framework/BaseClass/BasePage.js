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