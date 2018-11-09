var include = {};

var info = {
    roomMgr:'./roommgr',
    userMgr:'./usermgr',
    BaseClass:'../lib/BaseClass',
    Game:'./gameMgr/ddz/game',
    GameGold:'./gameMgr/ddz/game_gold',
    GameMatch:'./gameMgr/ddz/game_match',
    GameRoomGold:'./gameMgr/ddz/game_room_glod',
    GameRoomCard:'./gameMgr/ddz/game_room_card',
    Player:'./gameMgr/ddz/Player',
    DEFINE:'./Define',
};
include.getModel = function(name){
    console.log(info[name]);
    return require(info[name]);
}

module.exports = include;