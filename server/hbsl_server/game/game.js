var BaseClass = require('../lib/BaseClass');
var Player = require('./player');
var roomMgr = require('./roomMgr');
var userMgr = require('./userMgr');
var GameState = require("./define").GameStatu;
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
		this.roomInfo = roomInfo;
		this.conf = roomInfo.conf;
		this.compareCount = 0;
		this._cards = [];
		this.forceEnd = false;

		this.initParam();
		//初始化房间信息
		this.initPlayer();
		//初始化牌
		//this.initCard();
		//洗牌
		this.shuffle();
		//发牌
		this.fapai();
	},
	startAgain:function(){
		if(this.roomInfo.conf.numOfGames < this.roomInfo.conf.maxGames){
			return;
		}
		this.initParam();
		this.initPlayer();
		this.shuffle();
		this.fapai();
		var seats = this.roomInfo.seats;
		for(let i = 0; i < seats.length; ++i){
			//开局时，通知前端必要的数据
			let s = seats[i];
			//通知当前是第几局
			userMgr.sendMsg(s.userId,'game_num_push',this.roomInfo.numOfGames);
			//通知游戏开始
			userMgr.sendMsg(s.userId,'game_begin_push');
		}
	},
	// 初始数据
	initParam:function(roomInfo){
		this.state = GameState.GAME_PREPARE;
		//设置游戏状态为准备
		this.roomInfo.state = GameState.GAME_PREPARE;
		if(this.result){
			delete this.result;
		}
		if(!this.allResult)
		{
			this.allResult = []; 
		}
		this.compareCount = 0;
	},
	// 初始玩家
	initPlayer:function(){
		this.arrPlayers||(this.arrPlayers = []);
		//创建玩家
		var len = this.roomInfo.seats.length;
		for (var i = 0; i < len; i++) {
			var player = (this.arrPlayers[i] || new Player());
			player.initInfo(this.roomInfo.seats[i]);
			this.arrPlayers[i] = player;
			this.arrPlayers[i].JS_Name = this.roomInfo.seats[i].name;
			this.arrPlayers[i].score = 0;
		}
	},
	// 洗牌
	shuffle:function(){
		if(!this._cards){
			this._cards = [];
		}
		this._cards.length = 0;
		var arrType = [];
		var countPlayer = 0;
		arrType = [0,1];

		for(let i = 0;i < this.roomInfo.seats.length;i++){
			if(this.roomInfo.seats[i].userId > 0){
				countPlayer++;
			}
		}
		//0黑,1白
		for(let i = 0;i < arrType.length;i++){
			for(var j = 0; j < 10; j++){
				var card = {
					type:arrType[i],
					value:j
				}
				this._cards.push(card);
			}
		}

		var length = this._cards.length;
		for (var i = 0; i < length; i++) {
			var lastIndex = this._cards.length - 1 - i;
	        var index = Math.floor(Math.random() * lastIndex);
	        var t = this._cards[index];
	        this._cards[index] = this._cards[lastIndex];
	        this._cards[lastIndex] = t;
		}
	},
	//断线重连数据下发
	playerComeBack:function(userId){
        var data = {
            state:this.state,
			maxGames:this.roomInfo.conf.maxGames,
			numOfGames:this.roomInfo.numOfGames,
        };
		data.seats = [];
		for(var i = 0; i < this.roomInfo.seats.length; ++i){
			var rs = this.roomInfo.seats[i];
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
		if(this.state === GameState.GAME_PREPARE){
			
		}
		if(this.state === GameState.GAME_COMPARE){
			if(this.chupaidata){
				data.chupaidata = this.chupaidata;
			}
		}
		//
		if(this.state === GameState.GAME_START){
			data.holds = this.getHolds(userId);
		}
		//下发比牌数据和比牌结果
		if(this.state === GameState.GAME_OVER){
			data.comparePai = this.arrComparePai;
			data.result = this.result;
			if(this.roomInfo.conf.maxGames <= this.roomInfo.numOfGames){
				data.singleResult = this.singleResult;
				data.totalResult = this.totalResult;
			}
			else{
				data.singleResult = this.singleResult;
			}
		}
        //同步整个信息给客户端
        userMgr.sendMsg(userId,'game_sync_push',data);
	},
	getPlayers:function(userId){
		var len = this.arrPlayers.length;
		for(let i = 0; i < len; ++i){
			if(this.arrPlayers[i].userId === userId){
				return this.arrPlayers[i];
			}
		}
		return null;
	},
	fapai:function(){
		//在发牌的时候就确定比牌玩家数量
		var playerCount = 0;
		for(let i = 0;i < this.arrPlayers.length;i++){
			if(this.arrPlayers[i].userId > 0){
				playerCount++;
			}
		}
		this.compareCount = playerCount;
		//设置游戏状态为开始
		this.roomInfo.state = GameState.GAME_START;
		this.state = GameState.GAME_START;
		//倒计时出牌
		this.lastTime = 103000;//99秒理牌时间
		this.timeoutId = setTimeout(this.outMaxPai,this.lastTime,this);
		//每秒发送当前剩余时间
		this.timeId = setInterval(function(self){
			self.lastTime -= 1000;
			for(let i = 0;i<self.arrPlayers.length;i++){
				if(self.arrPlayers[i].userId != 0){
					let userId = self.arrPlayers[i].userId;
					userMgr.sendMsg(userId,'out_card_lastTime',self.lastTime);
				}
			}
		},1000,this);
	},
	//计算总结果
	calculateResult:function(){
		this.totalResult = [];//总结果
		var len = this.allResult.length;
		var allResult = this.allResult[0];
		if(allResult){	//如果有第一局数据，则计算总结果
			for(var i = 0; i < this.roomInfo.seats.length; i++){
				var temp = {};
				let userId = this.roomInfo.seats[i].userId;
				if(userId <= 0){
					continue;
				}
				temp.userId = userId;
				temp.userName = this.roomInfo.seats[i].name;
				temp.score = 0;
				temp.win = 0;
				temp.flat = 0;
				temp.lose = 0;
				this.totalResult.push(temp);
			}
			for(var i = 0; i < this.allResult.length; i++){
				for(let j = 0;j<this.allResult[i].length;j++){
					for(let m = 0;m<this.totalResult.length;m++){
						if(this.totalResult[m].userId === this.allResult[i][j].userId){
							this.totalResult[m].score += this.allResult[i][j].score;
							this.totalResult[m].win += this.allResult[i][j].win;
							this.totalResult[m].flat += this.allResult[i][j].flat;
							this.totalResult[m].lose += this.allResult[i][j].lose;
						}
					}
				}
			}
		}

		for (var i = 0; i < this.arrPlayers.length; i++) {
			let userId = this.arrPlayers[i].userId;
			userMgr.sendMsg(userId,'game_result',this.totalResult);
		}
		//如果局数已够，则进行整体结算,记录战绩
		if(allResult){
			if (this.forceEnd) {
				return;
			}
			this.forceEnd = true;
            if(this.roomInfo.numOfGames > 1){
                this.store_history(this.roomInfo);    
            } 
        }
		this.allResult = [];
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
			for(let j = 0;j<this.roomInfo.seats.length;j++){
				if(result[i].userId === this.roomInfo.seats[j].userId){
					result[i].allScore = this.roomInfo.seats[j].score;
				}
			}
		}
		//通知客户端单局游戏结束
		for (var i = 0; i < this.arrPlayers.length; i++) {
			let userId = this.arrPlayers[i].userId;
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
		for(let i = 0;i<this.arrPlayers.length;i++){
			if(this.arrPlayers[i].userId === userId){
				this.arrPlayers[i].userId = 0;
			}
			if(this.arrPlayers[i].userId > 0){
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
		clearInterval(this.timeId);
		clearTimeout(this.timeoutId);

		this.calculateResult();
		var roomId = roomMgr.getUserRoom(this.arrPlayers[0].userId);
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