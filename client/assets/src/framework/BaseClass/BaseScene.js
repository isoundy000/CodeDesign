// BaseScene
// 场景基类
// 主用于适配
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