var BaseClass = require('../../lib/BaseClass');
var Player = require('./player');
var roomMgr = require('../roomMgr');
var userMgr = require('../userMgr');
var Define = require("../define");
var Grid = require("./Grid");
var GameState = Define.GameStatu;
var GameAniSign = Define.GameAniSign;
var GameAnimal = Define.GameAnimal;
var GameGrid = Define.GameGrid;
var userDB = require('../../DB/managers/userDBMgr');
var crypto = require("../../utils/crypto");

/*   
	黑白兽林
	地图随机
	[0x0][0x1][0x2][0x3]
	[1x0][1x1][1x2][1x3]
	[2x0][2x1][2x2][2x3]
	[3x0][3x1][3x2][3x3]
	[4x0][4x1][4x2][4x3]
	[5x0][5x1][5x2][5x3]
	'山','火','水','洞',随机在(2x0 3x0 2x3 3x3)四个位置
	牌随机
	两个玩家 0-9 共20张随机在6x4的表格（'山','火','水','洞'位置不放置牌）
	玩家牌 黑白0-9 先首选择后确定双方牌 黑白分化
	大小规则0>1>2>3>4>5>6>7>8>9 ...特殊 9>2 （横竖相邻位置可杀）
	0 猎人
	1 红（鬼）
	2 象
	3 狮
	4 虎
	5 熊
	6 狼
	7 狗
	8 猫
	9 鼠
	猎人不能入火，鬼不能入水，象不能入洞，狮~鼠不能进火
*/

var Game = BaseClass.extend({
	Init:function(roomInfo){
		this.JS_Name = "Game";
		this._roomInfo = roomInfo;
		this._conf = roomInfo.conf;

		//初始化房间信息
		this.initParam();
		this.initPlayer();
		//初始化牌
		//洗牌
		this.shuffle();
		//发牌
		this.fapai();
	},
	startAgain:function(){
		if(this._roomInfo.conf.numOfGames < this._roomInfo.conf.maxGames){
			return;
		}
		this.initParam();
		this.initPlayer();
		this.shuffle();
		this.fapai();
		var seats = this._roomInfo.seats;
		for(let i = 0; i < seats.length; ++i){
			//开局时，通知前端必要的数据
			let s = seats[i];
			//通知当前是第几局
			userMgr.sendMsg(s.userId,'game_num_push',this._roomInfo.numOfGames);
			//通知游戏开始
			userMgr.sendMsg(s.userId,'game_begin_push');
		}
	},
	// 初始数据
	initParam:function(roomInfo){
		this._drawMapTime = 3000;//3秒绘制地图
		this._playerCount = 0;
		this._operationSeat = 0;//当前操作座位编号
		this._forceEnd = false;
		this._mapData = [];
		this._state = GameState.GAME_PREPARE;
		//设置游戏状态为准备
		this._roomInfo.state = GameState.GAME_PREPARE;
		if(!this._allResult)
		{
			this._allResult = []; 
		}
	},
	// 初始玩家
	initPlayer:function(){
		this._allPlayers||(this._allPlayers = []);
		//创建玩家
		var len = this._roomInfo.seats.length;
		for (var i = 0; i < len; i++) {
			var player = (this._allPlayers[i] || new Player());
			player.initInfo(this._roomInfo.seats[i]);
			this._allPlayers[i] = player;
			this._allPlayers[i].JS_Name = this._roomInfo.seats[i].name;
			this._allPlayers[i].score = 0;
		}
	},
	// 洗牌
	shuffle:function(){
		if(!this._mapData){
			this._mapData = [];
		}
		this._mapData.length = 0;
		// 动物
		var animals = [];
		//0黑,1白
		for(let i = 0;i < 2;i++){
			for(var j = 0; j < 10; j++){
				var animal = {
					type:i,
					value:j
				}
				animals.push(animal);
			}
		}
		var length = animals.length;
		for (var i = 0; i < length; i++) {
			var lastIndex = animals.length - 1 - i;
	        var index = Math.floor(Math.random() * lastIndex);
	        var t = animals[index];
	        animals[index] = animals[lastIndex];
	        animals[lastIndex] = t;
		}
		//山水火土
		var sshds = [GameAniSign.Mountain,GameAniSign.Water,GameAniSign.Fire,GameAniSign.Hole];
		var length = sshds.length;
		for (var i = 0; i < length; i++) {
			var lastIndex = sshds.length - 1 - i;
	        var index = Math.floor(Math.random() * lastIndex);
	        var t = sshds[index];
	        sshds[index] = sshds[lastIndex];
	        sshds[lastIndex] = t;
		}

		var countAni = 0;
		var countSshd = 0;
		for(var x =0;x < 4;x++){
			for(var y=0;y < 6;y++){
				var grid = new Grid(x,y);
				// 山火水洞
				if((x==0&&y==2)||(x==3&&y==2)||(x==0&&y==3)||(x==3&&y==3)){
					var sshd = {
						type: sshds[countSshd],
						value:-1,
					};
					grid.setSSHD(sshd);
					grid.setGridState(GameGrid.IsSSHD);
					this._mapData[x + "" + y] = grid;
					countSshd++;
					continue;
				}
				// 其他动物
				grid.setAnimal(animals[countAni]);
				grid.setGridState(GameGrid.NotFlip);
				this._mapData[x + "" + y] = grid;
				countAni ++;	
			}
		}
		console.log(this._mapData);
	},
	//断线重连数据下发
	playerComeBack:function(userId){
        var data = {
            state:this._state,
			maxGames:this._roomInfo.conf.maxGames,
			numOfGames:this._roomInfo.numOfGames,
        };
		data.seats = [];
		for(var i = 0; i < this._roomInfo.seats.length; ++i){
			var rs = this._roomInfo.seats[i];
			var online = false;
			if(rs.userId > 0){
				online = userMgr.isOnline(rs.userId);
			}
			var s = {
				userId:rs.userId,
				ip:rs.ip,
				score:rs.score,
				name:rs.name,
				online:online,
				seatindex:i
			}
			
			data.seats.push(s);
		}
		if(this._state === GameState.GAME_PREPARE){
			
		}
		if(this._state === GameState.GAME_COMPARE){
			if(this._mapData){
				data.mapData = this._mapData;
			}
		}
		// 操作颜色
		if(this._state === GameState.GAME_START){
			data.aniColor = this.getAniColor(userId);
		}
		//下发比牌数据和比牌结果
		if(this._state === GameState.GAME_OVER){
			if(this._roomInfo.conf.maxGames <= this._roomInfo.numOfGames){
				data.singleResult = this._singleResult;
				data.totalResult = this._totalResult;
			}
			else{
				data.singleResult = this._singleResult;
			}
		}
        //同步整个信息给客户端
        userMgr.sendMsg(userId,'game_sync_push',data);
	},
	getAniColor:function(userId){
		var len = this._allPlayers.length;
		for(var i = 0; i < len; i++){
			if(this._allPlayers[i].userId === userId){
				return this._allPlayers[i]._aniColor;
			}
		}
		return null;
	},
	getPlayers:function(userId){
		var len = this._allPlayers.length;
		for(let i = 0; i < len; ++i){
			if(this._allPlayers[i].userId === userId){
				return this._allPlayers[i];
			}
		}
		return null;
	},
	fapai:function(){
		userMgr.broacastInRoom('game_map_data_push',this._mapData);
		//设置游戏状态为开始
		this._roomInfo.state = GameState.GAME_START;
		this._state = GameState.GAME_START;
		// 给客户端3秒绘制地图 然后开始游戏
		this._timeDrawMapId = setTimeout(this.startGameMessage,this._drawMapTime,this);
		this.startUpdate();
	},
	startUpdate(){
		// 每秒发送当前剩余时间
		this._timeId = setInterval(function(self){
			for(let i = 0;i<self._allPlayers.length;i++){
				if(self._allPlayers[i].userId != 0){
					let userId = self._allPlayers[i].userId;
					userMgr.sendMsg(userId,'out_card_lastTime',self.lastTime);
				}
			}
		},1000,this);
	},

	startGameMessage:function(self){
		for(let i = 0;i<self._allPlayers.length;i++){
			var userId = self._allPlayers[i].userId;
			userMgr.sendMsg(userId,'game_begin_push');
		}
	},
	//计算总结果
	calculateResult:function(){
		this._totalResult = [];//总结果
		var len = this._allResult.length;
		var allResult = this._allResult[0];
		if(allResult){	//如果有第一局数据，则计算总结果
			for(var i = 0; i < this._roomInfo.seats.length; i++){
				var temp = {};
				let userId = this._roomInfo.seats[i].userId;
				if(userId <= 0){
					continue;
				}
				temp.userId = userId;
				temp.userName = this._roomInfo.seats[i].name;
				temp.score = 0;
				temp.win = 0;
				temp.flat = 0;
				temp.lose = 0;
				this._totalResult.push(temp);
			}
			for(var i = 0; i < this._allResult.length; i++){
				for(let j = 0;j<this._allResult[i].length;j++){
					for(let m = 0;m<this._totalResult.length;m++){
						if(this._totalResult[m].userId === this._allResult[i][j].userId){
							this._totalResult[m].score += this._allResult[i][j].score;
							this._totalResult[m].win += this._allResult[i][j].win;
							this._totalResult[m].flat += this._allResult[i][j].flat;
							this._totalResult[m].lose += this._allResult[i][j].lose;
						}
					}
				}
			}
		}

		for (var i = 0; i < this._allPlayers.length; i++) {
			let userId = this._allPlayers[i].userId;
			userMgr.sendMsg(userId,'game_result',this._totalResult);
		}
		//如果局数已够，则进行整体结算,记录战绩
		if(allResult){
			if (this._forceEnd) {
				return;
			}
			this._forceEnd = true;
            if(this._roomInfo.numOfGames > 1){
                this.store_history(this._roomInfo);    
            } 
        }
		this._allResult = [];
	},

	store_single_history:function(userId,history){
		userDB.get_user_history(userId,function(data){
			if(data == null){
				data = [];
			}
			while(data.length >= 10){
				data.shift();
			}
			if(userId != 0){
				data.push(history);
				userDB.update_user_history(userId,data);
			}
		});
	},
 	store_history:function(roomInfo){
		var seats = roomInfo.seats;
		var history = {
			uuid:roomInfo.uuid,
			id:roomInfo.id,
			time:roomInfo.createTime,
			seats:new Array(6)
		};

		for(var i = 0; i < seats.length; ++i){
			var rs = seats[i];
			var hs = history.seats[i] = {};
			hs.userid = rs.userId;
			hs.name = crypto.toBase64(rs.name);
			hs.score = rs.score;
		}

		for(var i = 0; i < seats.length; ++i){
			var s = seats[i];
			this.store_single_history(s.userId,history);
		}
	},
	singleOver:function(result){
		//添加每个人的分数
		for(let i = 0;i<result.length;i++){
			for(let j = 0;j<this._roomInfo.seats.length;j++){
				if(result[i].userId === this._roomInfo.seats[j].userId){
					result[i].allScore = this._roomInfo.seats[j].score;
				}
			}
		}
		//通知客户端单局游戏结束
		for (var i = 0; i < this._allPlayers.length; i++) {
			let userId = this._allPlayers[i].userId;
			userMgr.sendMsg(userId,'game_over_push',result);
		}
	},
	//退出房间
	exitRoom:function(userId){
		var havePlayer = false;
		var roomId = roomMgr.getUserRoom(userId);
		if(roomId === null){
			return;
		}
		for(let i = 0;i<this._allPlayers.length;i++){
			if(this._allPlayers[i].userId === userId){
				this._allPlayers[i].userId = 0;
			}
			if(this._allPlayers[i].userId > 0){
				havePlayer = true;
			}
		}
		userMgr.sendMsg(userId,'dispress_push');
		userMgr.kickUserInRoom(userId);
	},
	allExitRoom:function(roomId){
		userMgr.kickAllInRoom(roomId);
        roomMgr.destroy(roomId);
	},
	//扣除钻石
	doGameOver:function(){
		//把自动出牌的定时器关掉
		clearInterval(this._timeId);
		clearTimeout(this._timeDrawMapId);

		this.calculateResult();
		var roomId = roomMgr.getUserRoom(this._allPlayers[0].userId);
		var roomInfo = roomMgr.getRoom(roomId);
		var self = this;
		if(roomId == null){
			return;
		}
		if(roomInfo == null){
			return;
		}

		setTimeout(function(){
			//通知客户端房间解散
			for (var i = 0; i < self.roomInfo.seats.length; i++) {
				let userId = self.roomInfo.seats[i].userId;
				let koufeiId = 0;
				if(userId === 0){
					continue;
				}
				if(roomInfo.conf.koufeixuanze === 0){ //房主自费
					koufeiId = self.roomInfo.seats[0].userId;
				}
				else{
					koufeiId = userId;
				}
				//扣除房卡，每人一钻
				let cost = 1;
				userDB.cost_gems(koufeiId,cost);
			}
			for (var i = 0; i < self.roomInfo.seats.length; i++) {
				var userId = self.roomInfo.seats[i].userId;
				self.exitRoom(userId);
			}
			roomMgr.destroy(roomId);
        },0);
	},

});



module.exports = Game;
var game = new Game({conf:{},seats:[{userId : 1},{userId : 2}] });

