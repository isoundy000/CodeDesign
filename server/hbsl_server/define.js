var DEFINE = {};
DEFINE.GameStatu = {
	GAME_WAIT : 0, 	//等待
	GAME_PREPARE:1, //准备
	GAME_START:2, 	//开始
	GAME_RUN:3, 	//运行
	GAME_END:4, 	//结束
	GAME_OVER:5, 	//完
	GAME_COMPARE:6, //对比 结算
};

/*十二生肖对应表 zodiac
鼠（Rat）
牛（Ox）  
虎（Tiger）
兔（Hare）
龙（Dragon）
蛇（Snake）
马（Horse）
羊（Sheep）
猴（Monkey）
鸡（Rooster）
狗（Dog）
猪（Boar）
*/

DEFINE.GameAnimal = {
	Hunter : 0,//猎人
	Ghost : 1,//鬼
	Elephant : 2,//象
	Lion : 3,//狮
	Tiger : 4,//虎
	Bear : 5,//熊
	Wolf : 6,//狼
	Dog : 7,//狗
	Cat : 8,//猫
	Rat : 9,//鼠	
};

DEFINE.GameAniColor = {
	Black : 0,//黑
	White : 1,//白
};

module.exports = DEFINE;