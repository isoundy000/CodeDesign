var Define = {};
Define.CardType = {
	NONE:0,
	DAN:1,//单张
	YI_DUI:1,//一对
	SAN_BU_DAI:1,//三不带
	SAN_DAI_YI_ZHANG:1,//三带一
	SAN_DAI_YI_DUI:1,//三带一对
	SI_DAI_ER:1,//四带二
	SI_DAI_ER_DUI:1,//四带二对
	ER_FEI_JI_BU_DAI:1,//二飞机不带
	ER_FEI_JI_DAI_ER_ZHANG:1,//二飞机带二张
	ER_FEI_JI_DAI_ER_DUI:1,//二飞机带二对
	SAN_FEI_JI_BU_DAI:1,//三飞机不带
	SAN_FEI_JI_DAI_SAN_ZHANG:1,//三飞机带三张
	SAN_FEI_JI_DAI_SAN_DUI:1,//三飞机带三对
	SI_FEI_JI_BU_DAI:1,//四飞机不带
	SI_FEI_JI_DAI_SI_ZHANG:1,//四飞机带四张
	SI_FEI_JI_DAI_SI_DUI:1,//四飞机带四对
	WU_FEI_JI_BU_DAI:1,//五飞机不带
	WU_FEI_JI_DAI_WU_ZHANG:1,//五飞机带一张
	LIU_FEI_JI_BU_DAI:1,//六飞机不带
	SHUN_ZI:1,//顺子
	LIAN_DUI:1,//连对
	ZHA_DAN:1,//炸弹
	WAN_ZHA:1,//王炸
};

Define.GameState = {
	GAME_PREPARE:0,//准备
	GAME_START:1,  //开始
	GAME_END:2,    //结束单局
	GAME_OVER:3,   //结束
	GAME_COMPARE:4,//比较
};

Define.PlayerState = {
	PLAYER_STAND:0,     //站着未准备
	PLAYER_READY:1,     //准备
	PLAYER_GAME:2,      //在游戏
	PLAYER_ONLINE:3,    //在线
	PLAYER_OFFLINE:5,   //离线
	PLAYER_TUOGUAN:4,   //托管
};

Define.GAME_TYPE = {
	GAME_NORMAL:0, //一般的房间
	GAME_GOLD:1,   //金币场
	GAME_MATCH:2,  //比赛场
	GAME_ROOM_GOLD:3,//金币房间
	GAME_ROOM_CARD:4,//房卡消耗
};

module.exports = Define;