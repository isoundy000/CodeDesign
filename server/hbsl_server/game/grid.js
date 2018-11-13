var BaseClass = require('../../lib/BaseClass');
var Define = require("../define");
var GameGrid = Define.GameGrid;
var Grid = BaseClass.extend({
	Init:function(x,y){
		this.JS_Name = "Grid";
		this._x = null;
		this._y = null;
		this._animal = null;
		this._sshd = null;
		this._state = GameGrid.IsNull;
		this._initParam(x,y);
	},
	_initParam:function(x,y){
		this._x = x;
		this._y = y;
	},
	setAnimal:function(animal){
		this._animal = animal;
	},
	setSSHD:function(sshd){
		this._sshd = sshd;
	},
	setGridState:function(state){
		this._state = state;
	},
})

module.exports = Grid;