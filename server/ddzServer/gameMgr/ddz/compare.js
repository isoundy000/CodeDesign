var CardType = require("../../Define").CardType;
var Compare = {}

//说明：拿到牌马上进行排序，以下函数均针对排序后的数组


//同类型比较大小
Compare.compareSameType = function(arrPai1, arrPai2, type){
	
};
//比较大小
Compare.comparPai = function(arrPai1, arrPai2){
	var type1 = Compare.getType(arrPai1);
	var type2 = Compare.getType(arrPai2);
	if (type1 !== type2) {
		return 1;
	}
	else{
		return Compare.compareSameType(arrPai1, arrPai2, type1);
	}
	return -1;
};

module.exports = Compare;

/**
* 用1个字节(8 bit)来表示一张牌
* 前4位表示花色
* 后4位表示13张牌 以及大小王
* @param num
*/
function getCardValue(num){
    let value = num & 15;
    return value;
}
function getCardColor(num) {
    let color = num >> 4;
    return color;
}
// 转换成客服端的扑克牌
function conversionClientCard(num) {
    let ret = {}
    ret.num = num;
    ret.value = num & 15;
    ret.color = num >> 4;
    ret.level = XMQ.Card.compareValue[ret.value];
    return ret;
}
// 转换成客服端的扑克牌数组
function conversionClientCards(cards) {
    var ret = [];
    for (var i = 0; i < cards.length; i++) {
        let card = conversionClientCard(cards[i]);
        ret.push(card)
    }
    return ret;
}
// 数值排序
function sortCardsLevel(cards,isBigToSmall) {
    if(isBigToSmall){
        cards.sort((A, B) => {
            return B.level - A.level;
        });
    }else{
        cards.sort((A, B) => {
            return A.level - B.level;
        });
    }
}
// 等级排序
function sortCardsValue(cards,isBigToSmall) {
    if(isBigToSmall){
        cards.sort((A, B) => {
            return B.value - A.value;
        });
    }else{
        cards.sort((A, B) => {
            return A.value - B.value;
        });
    }
}
// 获取卡牌值对应张数列表
function getValueList (clientCards) {
    let ret = [];
    clientCards.forEach(element => {
        if (ret[element.value]) {
            ret[element.value].push(element);
        } else {
            ret[element.value] = [];
            ret[element.value].push(element);
        }
    });
    return ret;
}
var emptyArray = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
function getArrayList(clientCards){
    let ret = emptyArray;
    clientCards.forEach(element => {
        ret[0][element.value] ++;
    });
    for (let i = 1; i <= 16; ++i) {
        for (let j = 4; j >= 1; --j){
            if (ret[0][i] >= j) {
                ret[j][i] = ret[0][i];
            } else {
                ret[j][i] = 0;
            }
        }
    }
    return ret;
}
// 获取valueListCard 长度
function getValueListLength(valueListCards){
    let count = 0
    valueListCards.forEach(element => {
            count ++
        });
    return count;
}
//癞子
let laiZi = 11;
//set get clear 癞子
function clear(){laiZi = null;}
function setLaiZi(num){laiZi = num;}
function getLaiZi(){return laiZi;}
//是否考虑癞子
function hasCalculateLaiZi(){
    return laiZi !== null;
}
//是否包含癞子 cards is valuelist or clientcards
function isIncludeLaiZi(cards,isNotValueList){
    return getIncludeLaiZiCount(cards,isNotValueList) > 0;
}
//癞子的张数
function getIncludeLaiZiCount(cards,isNotValueList){
    let key = getCardValue(laiZi);
    if(isNotValueList){
        let ret = getValueList(cards);
        return ret[key] && ret[key].length > 0 ? ret[key].length : 0;
    }
    return cards[key] && cards[key].length > 0 ? cards[key].length : 0;
}
//包含大小王
function includeJoker(cards){
    return includeBJoker(cards) || includeLJoker(cards);
}
//包含大王
function includeBJoker(cards){
    let key = XMQ.Card.Value.JokerBig
    return cards[key] && cards[key].length > 0;
}
//包含小王
function includeLJoker(cards){
    let key = XMQ.Card.Value.JokerLittle
    return cards[key] && cards[key].length > 0;
}
//包含2
function includeTwo(cards){
    let key = XMQ.Card.Value.Two
    return cards[key] && cards[key].length > 0;
}
//包含王2
function includeJokerTwo(cards){
    return includeJoker(cards) || includeTwo(cards);
}
/**
*消耗癞子N张
* N 几张 lCount癞子张数
*/
function expentLaiZi_N_Zhang(valueListCards,N,lCount){
    let cards = cc.js.cloneTable(valueListCards);
    let has = false,count = lCount;
    let key = getCardValue(laiZi);
    if(cards[key].length === N)return true;
    delete cards[key];
    cards.forEach(element => {
        if (element.length + count >= N ) {
            has = true;
            count -= (N - element.length);
        }
    });
    cc.log("===is_N_Zhang include laizi ",has,count);
    return has && count === 0;                
}

function is_N_Zhang(valueListCards,N){
    if(includeJoker(valueListCards))return false;
    let count = 0,has = false;
    if(hasCalculateLaiZi()){
        let lCount = getIncludeLaiZiCount(valueListCards);
        if(lCount > 0){
            return expentLaiZi_N_Zhang(valueListCards,N,lCount);
        }
    }
    valueListCards.forEach(element => {
        count++;
        if (element.length === N) {
            has = true;
        }
    });
    cc.log("===is_N_Zhang not include laizi ",has,count);
    return has && count === 1;
}
/**
*消耗癞子N带M
* N 3||4 带 1||2  C 1||2 张
*/
function expentLaiZi_M_Dai_NC(valueListCards,M,N,C,lCount){
    let cards = cc.js.cloneTable(valueListCards);
    let per1 = 0,per2 = 0,has = false,count = lCount;
    let key = getCardValue(laiZi);
    delete cards[key];
    cards.forEach(element => {
        let bHas = true;
        if (element.length + count >= M) {
            has = true;
            bHas = false;
            per1++;
            count -= (M-element.length);
        }
        if(bHas){
            if (element.length +count >= C) {
                per2++;
                count -= (C-element.length);
            }
        }
    });
    cc.log("===is_M_Dai_NC include laizi ",has,per1,per2,count);
    if(count > 0){
        per2++;
        cc.log("===is_M_Dai_NC include laizi ++",has,per1,per2,count);
    };
    return M === 3 ?
    has && per1=== 1 && per2 === N :
    (has && per1=== 1 && per2 === N) || (has && per1=== N);
}

function is_M_Dai_NC(valueListCards,M,N,C){
    cc.log("===is_M_Dai_NC M N C",M,N,C);
    let per1 = 0,per2 = 0,has = false;
    if(hasCalculateLaiZi()){
        let lCount = getIncludeLaiZiCount(valueListCards);
        if(lCount > 0){
            return expentLaiZi_M_Dai_NC(valueListCards,M,N,C,lCount);
        }
    }
    valueListCards.forEach(element => {
        if (element.length === M) {
            has = true;
            per1++;
        }
        if (element.length === C) {
            per2++;
        }
    });
    cc.log("===is_M_Dai_NC not include laizi ",has,per1,per2);
    return M === 3 ?
    has && per1=== 1 && per2 === N :
    (has && per1=== 1 && per2 === N) || (has && per1=== N);
}
/**
*消耗癞子顺连飞机不带
* N 1连子||2连对||3-6飞机   C 1||2||3 张
*/
function expentLaiZi_SL_NC(valueListCards,N,C,lCount){
    cc.log("===is_SL_NC include laizi",N,C,lCount);
    let lC=lCount;
    if(lC === 0){
        return is_SL_NC(valueListCards,N,C,true);
    }
    var isIncludeCard = function(valueListCards, cardValue,C) {
        let card = conversionClientCard(cardValue);
        if(cc.js.isValid(valueListCards[card.value])){
            if(valueListCards[card.value].length >= C){
                return true;
            }
        }
        return false;
    }
    var addClientValue = function(valueListCards,value){
        let card = conversionClientCard(value);
        card.isLaiZi = true;
        if (valueListCards[card.value]) {
            valueListCards[card.value].push(card);
        } else {
            valueListCards[card.value] = [];
            valueListCards[card.value].push(card);
        }
    }
    var removeClientValue = function(valueListCards,value){
        let card = conversionClientCard(value);
        if (valueListCards[card.value]) {
            for(let i=valueListCards[card.value].length -1;i>=0;i--){
                if(value === valueListCards[card.value][i].num && valueListCards[card.value][i].isLaiZi){
                    // delete valueListCards[card.value][i];
                    valueListCards[card.value].splice(i, 1);
                }
            }
        }
    }
    var getMaxMinValue = function(valueListCards){
        let min = 3,max = 3;
        valueListCards.forEach(element => {
            if(cc.js.isValid(element[0])){
                if(element[0].value){
                    if(min >= element[0].value){
                        min = element[0].value;
                    }
                    if(max <= element[0].value){
                        max = element[0].value;
                    }
                }
            }
        });
        return {max,min};
    }
    //这种消耗太大太费时间不能采用需优化
    for(let i=14;i>=3;i--){
        let value = i;
        if(value===14){value=1;}
        if(isIncludeCard(valueListCards,value,C))continue;
        addClientValue(valueListCards,value);
        let b = expentLaiZi_SL_NC(valueListCards,N,C,lC-1);
        removeClientValue(valueListCards,value);
        if(b)return true;
    }
    return false;
}

function expentLaiZi_SL_NC(valueListCards,N,C,lCount){
    let length = 0,lC = 0,canRun = true,min = 14,max = 3;
    let key = getCardValue(laiZi);
    valueListCards.forEach(element => {
        length += element.length; 
        if(cc.js.isValid(element[0]) && element[0].value ){
            if(element[0].value !== key){
                if (element.length > C) {
                    canRun = false;
                }
                let v = element[0].value === 1 ? 14 : element[0].value;
                if(min >= v){
                    min = v;
                }
                if(max <= v){
                    max = v;
                }
            }
        }
    });
    cc.log("===== canRun min max",canRun,min,max);
    if(canRun){
        let forLenght = length / C;
        cc.log("===== canRun min max",canRun,min,max,length,forLenght);
        if(max - min > forLenght)return false;
        let start = min;
        if(min + forLenght -1 > 14){
            start = min - ((min + forLenght -1)%14)/C;
        }
        cc.log("===== canRun min max",canRun,min,max,length,forLenght,start);
        for(let i = start;i< start+forLenght;i++){
            let index = i===14 ? 1: i;
            if(cc.js.isValid(valueListCards[index])){
                if(index === key){
                    lC += C;
                }else{
                    lC += (C - valueListCards[index].length)
                }
            }else{
                lC += C;
            }
        }
        cc.log("===== canRun min max",canRun,min,max,length,forLenght,start,lC);
        if(lC === lCount)return true;
    }
    return false;
}

function is_SL_NC(valueListCards,N,C){
    cc.log("===is_SL_NC N C",N,C);
    if(includeJokerTwo(valueListCards))return false;
    if(hasCalculateLaiZi()){
        let lCount = getIncludeLaiZiCount(valueListCards);
        if(lCount > 0){
            return expentLaiZi_SL_NC(valueListCards,N,C,lCount);
        }
    }
    let count = 0;
    let length = 0;
    let per = null;
    valueListCards.forEach(element => {
        length += element.length; 
        if (element.length === C) {
            if(per){
                if(Math.abs(element[0].value - per) === 1 || Math.abs(element[0].value - per) === 12){
                    count++;
                    per = element[0].value;
                }else{
                    per = element[0].value
                }
            }else{
                per = element[0].value;
                count++;
            }
        }
    });
    cc.log("===is_SL_NC not include laizi",count,length);
    if(N === 1){ //连子
        return count >= length/N && count >= 5
    }else if(N === 2){ //连对
        return count >= length/N && count >= 3
    }else if(N > 2){ //飞机不带
        return count === N;
    }
}
/**
*消耗癞子n飞机带
* N 2-6飞机   C 1单||2 对
*/
function expentLaiZi_N_Fei_C(valueListCards,N,C,lCount){
    let length = 0,lC = lCount,min = 14,max = 3;
    let key = getCardValue(laiZi);
    let vList = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    valueListCards.forEach(element => {
        length += element.length; 
        if(cc.js.isValid(element[0]) && element[0].value ){
            if(element[0].value !== key && element[0].value < 14){
                let v = element[0].value === 1 ? 14 : element[0].value;
                vList[v] = element.length;
                if(min >= v){
                    min = v;
                }
                if(max <= v){
                    max = v;
                }
            }
        }
    });
    cc.log("===== length vList min max",length,vList,min,max);
    if( C===2){
        for(let i=min;i<=max;i++){
            if(vList[i] === 1){
                lC --;
                vList[i]++;
            }
        }
    }
    for(let i=min;i<=max;i++){
        let count = vList[i];
        if(vList[i]>0){
            for(let j=1;j<N;j++){
                count +=vList[i+j];
            }
        }
        if( C === 1 ? count + lC >= 3*N : count + lC === 3*N){return true};
    }
    return false;
}

function is_N_Fei_C(valueListCards,N,C){
    cc.log("===is_M_Fei_NC N C",N,C);
    if(C ===2){
        if(includeJoker(valueListCards))return false;
    }
    if(hasCalculateLaiZi()){
        let lCount = getIncludeLaiZiCount(valueListCards);
        if(lCount > 0){
            return expentLaiZi_N_Fei_C(valueListCards,N,C,lCount);
        }
    }
    let count = 0;
    let count_two = 0;
    let length = 0;
    let per = null;
    valueListCards.forEach(element => {
        length += element.length;
        if ( C === 1?element.length >= 3:element.length === 3) {
            if(XMQ.Card.Value.Two !== element[0].value){
                if(per){
                    if(Math.abs(element[0].value - per) === 1 || Math.abs(element[0].value - per) === 12){
                        count++;
                        per = element[0].value;
                    }else{
                        per = element[0].value
                    }
                }else{
                    per = element[0].value;
                    count++;
                }
            }
        }
        if (element.length === C) {
            count_two++;
        }else if(element.length === 2*C){
            count_two += 2;
        } 
    });
    return C===1 ?(count === N && length ===(3*(count + C))):(count === N && count_two === N && length ===(3*(count + C)));
}




//////////////////////////////////////////////////////////////////////////////////////////
//算法调整
/////////////////////////////////////////////////////////////////////////////////////////
let typeWerght = cc.Enum({  //权值
    "DanZhang"  : 1,
    "DuiZi"     : 2,
    "ThreeZhang": 3,
    "LianZi"    : 4,//多一张加1
    "LianDui"   : 5,//多一对加2
    "FeiJi"     : 6,//多一翅加3
    "ZhaDan"    : 7 //包含双王
});

let danZhang = [];
let duiZi    = [];
let threeZhang = [];
let lianZi  = [];
let lianDui = [];
let feiJi   = [];
let zhaDan  = [];

// 手数 权值 拆牌 带牌手数需要减一


let newCompare ={
    getCardValue,
    getCardColor,
    conversionClientCard,
    conversionClientCards,
    sortCardsLevel,
    sortCardsValue,
    getValueList,
}

////////////////////////////////////////////////////////////////////////////////////
let CNode = {
    cType : 0,//牌型
    cMain : 0,//主值
    cSub  : 0,//副值
    cPower: 0,//权值 aggregate
    cCount: 0,//张数
    cScore: 0,//分数
    cSeral: 0,//连续张数
    cCards: [],//牌
}


// 以下为牌的面值，从3开始
let kCard_ValueLeast        =   2;
let kCard_Value3            =   3;
let kCard_Value4            =   4;
let kCard_Value5            =   5;
let kCard_Value6            =   6;
let kCard_Value7            =   7;
let kCard_Value8            =   8;
let kCard_Value9            =   9;
let kCard_ValueT            =   10;
let kCard_ValueJ            =   11;
let kCard_ValueQ            =   12;
let kCard_ValueK            =   13;
let kCard_ValueA            =   14;
let kCard_Value2            =   15;
let kCard_ValueJoker1       =   16;
let kCard_ValueJoker2       =   17;
let kCard_ValueMax          =   18;

let kCard_TableMax          =   20;
let kCard_KindMax           =   5;

// 特殊牌值
let kCard_Joker1            =   53;
let kCard_Joker2            =   54;
let kCard_Flower            =   55;

let kCardMask_CardValue     =   0x00ff;
let kCardMask_AnyMatch      =   0x0100;

let kMaxCardNum             =   56;
let kMaxPlayers             =   3;

function getCardValue(num){
    let v = num & kCardMask_CardValue;
    if (v == kCard_Flower) {
        return kCard_ValueMax;
    }
    if (v == kCard_Joker1) {
        return kCard_ValueJoker1;
    }
    if (v == kCard_Joker2) {
        return kCard_ValueJoker2;
    }
    let t = v % 13;
    if (t < 3) {
        t += 13;
    }
    return t;
}
var emptyArray = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
let CCJSArray = cc.js.Array;
let myHandCards = {
    mHandCards : [],
    mCardsArray : emptyArray,
    mCardsObject:[],
    initHandCards(cards){
        this.mHandCards = CCJSArray.copy(cards);
        _initCardsArrayAndObject();
    },
    _initCardsArrayAndObject(){
        for(let i = 0;i<= this.mHandCards.length;i++){
            let val = getCardValue(this.mHandCards[i]);
            this.mCardsArray[0][val]++;
            if(!this.mCardsObject[val]){
                this.mCardsObject[val] = [];
            }
            this.mCardsObject[val].push(this.mHandCards[i]);
        }
        for (let i = kCard_Value3; i <= kCard_Value2; ++i) {
            for (let num = 4; num >= 1; --num) {
                if (this.mCardsArray[0][i] >= num) {
                    if (i <= kCard_ValueA) {
                        this.mCardsArray[num][i] = this.mCardsArray[num][i - 1] + 1;
                    } else {
                        this.mCardsArray[num][i] = 1;
                    }
                } else {
                    this.mCardsArray[num][i] = 0;
                }
            }
        }
    },
    
}