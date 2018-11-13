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
// 使用动物
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
DEFINE.GameAniName = {
	0:"Hunter",//猎人
	1:"Ghost",//鬼
	2:"Elephant",//象
	3:"Lion",//狮
	4:"Tiger",//虎
	5:"Bear",//熊
	6:"Wolf",//狼
	7:"Dog",//狗
	8:"Cat",//猫
	9:"Rat",//鼠	
};
// 动物颜色
DEFINE.GameAniSign = {
	Black : 0,//黑
	White : 1,//白
	Mountain:10,//山
	Water:20, 	//水
	Fire:30,	//火
	Hole:40,  	//洞
};

//游戏格子 row_x row_y col 
DEFINE.GameGrid ={
	IsNull : 0, //空格子
	HaveAnimal :1,//翻盖后有动物
	NotFlip : 2, //没有翻盖
	IsSSHD : 3,//山水火洞
};

module.exports = DEFINE;