// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
require("./framework");
//利用window.onerror 函数 写bug 或者将bug 发送到服务器
(funtion(){
	if(!CC_EDITOR){ 
	    const type='ERROR_LOG', key = 'SystemError';
	    window.onerror = function(msg, url, line) {
	        var errorMsg = {
	            message : msg,
	            url : url,
	            line : line,
	            datetime : new Date().Format("yyyy-MM-dd hh:mm:ss")
	        }, value = GLocalStorage.getItem(type, key) || [];
	        if(value.length > 10) { //just have 10 records are stored
	            value.shift();
	        }
	        value.push(errorMsg);
	        GLocalStorage.setItem(type, key, value);
	        //send error message to server 
	        // socket.send("CLIENT_ERROR_MESSAGE",errorMsg);
	        return false;
	    };
	}
})();

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {},

    // update (dt) {},
});
