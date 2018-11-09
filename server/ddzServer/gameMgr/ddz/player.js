var include = require('../../include');
var BaseClass = include.getModel('BaseClass');

var Player = BaseClass.extend({
	Init:function(){
		this.JS_Name = "Player";
		
		this.holds = [];           //持有的牌
		this.WaitingState = false; //等待状态
		this.isTuoGuan = false;    //是否托管
		this.folds = [];           //出过的牌
	},

	initInfo:function(data){
		if(data.disconnectOutTime){
			this.userId = 0;
			return;
		}
		this.userId = data.userId;
		this.name = data.name;
	},
	_isShot : false,
    shotShare(node) {
        if(this._isShot || !CC_JSB ){
            return;
        }
        this._isShot = true;
        var size = cc.director.getWinSize();
        var currentDate = new Date();
        var fileName = "result_share.jpg";
        //不同平台不一样
        if (cc.sys.isNative) {
            var fullPath = jsb.fileUtils.getWritablePath() + fileName;
            if(jsb.fileUtils.isFileExist(fullPath)){
                jsb.fileUtils.removeFile(fullPath);
            }
        }else{

        }
        var renderTexture = cc.RenderTexture.create(Math.floor(size.width),Math.floor(size.height), cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
        renderTexture.active = false;
        renderTexture.setPosition(cc.p(0,0));
        renderTexture.begin();
        if(node){
            node._sgNode.visit();
        }else{
            cc.director.getRunningScene().visit();
        }
        renderTexture.end();
        if (cc.sys.isNative) {
            renderTexture.saveToFile(fileName, cc.IMAGE_FORMAT_JPG);
        }else{

        }
        
        /**
         * renderTexture callback function is not use 
        // renderTexture.saveToFile("demo.png", cc.IMAGE_FORMAT_PNG, true, function () {
        renderTexture.saveToFile("demo.png",true,function(){
            cc.log("save success");
            XMQ.view.openScene("HallScene");
        });
        */
        var self = this;
        var tryTimes = 0;
        var fn = function(){
            if (cc.sys.isNative) {
                if(jsb.fileUtils.isFileExist(fullPath)){
                    var height = 100;
                    var scale = height/size.height;
                    var width = Math.floor(size.width * scale);
                    XMQ.bridge.share();
                    self._isShot = false;
                }else{
                    tryTimes++;
                    if(tryTimes > 10){
                        console.log("time out...");
                        return;
                    }
                    setTimeout(fn,50); 
                }
            }else{
                
            }
        }
        setTimeout(fn,50);
    },
});

module.exports = Player;
