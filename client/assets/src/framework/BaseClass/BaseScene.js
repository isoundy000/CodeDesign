// BaseScene
// 场景基类
// 主用于适配

var adapter = {
	adapterPortrait: function (cvs) {
	    let designSz = cc.size(cvs.designResolution.width, cvs.designResolution.height);
	    let viewSz = cc.view.getFrameSize();
	    let frameSz = cc.size(viewSz.width, viewSz.height);
	    if (designSz.width / designSz.height > frameSz.width / frameSz.height) {
	        cvs.fitWidth = true;
	        cvs.fitHeight = false;
	    } else {
	        cvs.fitWidth = false;
	        cvs.fitHeight = true;
	    }
	},
	adapterLandscape(cvs, portraitRootNode){
		 // 粗暴的根据画布的尺寸来区分当前画布设计为横屏还是竖屏
        let designSz = cc.size(cvs.designResolution.width, cvs.designResolution.height);
        let designOt = cc.macro.ORIENTATION_PORTRAIT;
        if (designSz.width > designSz.height) {
            designOt = cc.macro.ORIENTATION_LANDSCAPE;
        }
        // 粗暴的根据尺寸来区分现在设备处于横屏还是竖屏
        let viewSz = cc.view.getFrameSize();
        let frameSz = cc.size(viewSz.width, viewSz.height);
        let frameOt = cc.macro.ORIENTATION_PORTRAIT;
        if (frameSz.width > frameSz.height) {
            frameOt = cc.macro.ORIENTATION_LANDSCAPE;
        }
        if (frameOt !== designOt) {
            this._changeOrientation(cvs, portraitRootNode, designOt, designSz, frameSz);
        }

        // 统一采用横屏的方式适配
        if (designOt === cc.macro.ORIENTATION_PORTRAIT) {
            this._swapSize(designSz);
        }
        if (frameOt === cc.macro.ORIENTATION_PORTRAIT) {
            this._swapSize(frameSz);
        }

        // 横屏适配(留黑边方案)
        let isContrary = designOt === cc.macro.ORIENTATION_PORTRAIT;
        if (designSz.width / designSz.height > frameSz.width / frameSz.height) {
            cvs.fitWidth = true && !isContrary;
            cvs.fitHeight = false || isContrary;
        } else {
            cvs.fitWidth = false || isContrary;
            cvs.fitHeight = true && !isContrary;
        }
	},
	_swapSize: function (sz) {
        let w = sz.width;
        sz.width = sz.height;
        sz.height = w;
    },
    // 旋转屏幕(仅在windows上测试时真的旋转)
    _changeOrientation: function (cvs, portraitRootNode, designOt, designSz, frameSz) {
        if (cc.sys.os === "Windows") {
            cc.view.setDesignResolutionSize(designSz.width, designSz.height);
            cc.view.setFrameSize(frameSz.height, frameSz.width);
            cc.view.setOrientation(designOt);
        } else {
            // 真机上并不旋转屏幕 只把竖屏场景转换成横屏即可
            if (designOt === cc.macro.ORIENTATION_PORTRAIT) {
                if (portraitRootNode === null) {
                    cc.error("portraitNode must not be null when orientation is PORTRAIT");
                    return
                }
                // 首先把 Canvas 的设计分辨率互换
                // 其次把 portraitRootNode 旋转-90度 且 宽高互换
                cvs.designResolution = cc.size(designSz.height, designSz.width);
                portraitRootNode.rotation = -90;
                portraitRootNode.width = cvs.node.height;
                portraitRootNode.height = cvs.node.width;
            }
        }
    },
}

cc.Class({
	extends: cc.Component,
	
	properties:{

		prefabs: {
			type: cc.Prefab,
			default: [],
			tooltip: "场景中其他prefad",
		},

	},
	
	onLoad(){

	},

	

	// 场景中的通用事件
	_initSceneEvent(){
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this._onKeyPressed, this);
	
	},

	// 销毁事件
	_destorySceneEvent(){
		cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this._onKeyPressed, this);

	},

	// 按钮事件
	_onKeyPressed(event){
		//还回
		if(event.keyCode === cc.KEY.back){
			this._onPresseBack();
		}
	},

	//还回
	_onPresseBack(){

	},
})