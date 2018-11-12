var BaseClass = require('../lib/BaseClass');
var Player = BaseClass.extend({
	Init:function(){
		this.JS_Name = "Player";
		this._animals = [];
		this._dieAnimals= [];
	},
	initInfo:function(data){
		if(data.disconnectOutTime){
			this.userId = 0;
			return;
		}
		this.userId = data.userId;
	},
})

module.exports = Player;