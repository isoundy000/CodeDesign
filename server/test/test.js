let levelValue = {
        "15": 17,
        "14": 16,
        "2": 15,
        "1": 14,
        "13": 13,
        "12": 12,
        "11": 11,
        "10": 10,
        "9": 9,
        "8": 8,
        "7": 7,
        "6": 6,
        "5": 5,
        "4": 4,
        "3": 3,
};
var emptyArray = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

var CardType = {
    Undefine: 0, //未定义
    Dan_Zhang: 1, //单张
    Yi_Dui: 2, //一对
    San_Bu_Dai: 3, //三不带
    San_Dai_Yi: 4, //三带一
    San_Dai_Er: 5, //三带二
    Si_Dai_Er: 6, //四带二
    Si_Dai_Er_Dui: 7, //四带两队
    Shun_Zi: 8, //顺子
    Lian_Dui: 9, //连对
    Fei_Ji_Bu_Dai: 10, //飞机不带
    Fei_Ji_Dai_Zhang: 11, //飞机带张
    Fei_Ji_Dai_Dui: 12, //飞机带队
    Zha_Dan: 13, //炸弹
    Wang_Zha:14,//王炸
};
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

let Power = {
	DanZhang : 1,
	DuiZi : 2,
	SanZhang : 3,
	ShunZi : 4,//(每多一张牌权值+1)
	LianDui : 5,//(每多一对牌，权值+2)
	FeiJi : 6,//(每对以飞机，权值在基础上+3)
	ZhaDan : 7,//(包括对王在内)
}

class Card {
  constructor(num) {
    this.num = num;
    this.value = num & 15;
    this.color = num >> 4;
    this.level = levelValue[this.value];
  }
}
var card = new Card(54);
console.log(card)

class HandCards{
	constructor(arr){
		this.serverCardArray = arr;
		var clientCardInfo = this.conversionArrayToClientInfo(arr);
		this.handCountArray = clientCardInfo.handCountArray;
		this.handCardsArray = clientCardInfo.handCardsArray;
		this.handCardsSetArray = Array.from(clientCardInfo.handCardsSet).sort((a,b)=>{if(a === b){return b - a;}else{return a - b;}});

		this.cType = 0;//牌型
	    this.cMain = 0;//主值
	    this.cSub  = 0;//副值
	    this.cPower= 0;//权值 aggregate
	    this.cSeral= 0;//连续张数
	    this.cCount= 0;//张数
        this.hCount= 0;//手数

	    this.mDanZhang=[];
		this.mDuiZi   =[];
		this.mSanZhang=[];
		this.mLianDui =[];
		this.mShunZi  =[];
		this.mFeiJi   =[];
		this.mZhaDan  =[];
		this.mDispose =[];
        // this.dealHandCards();
	}
	checkCardIsRelate(index){
		//判断牌和其他的牌是否有关系
		//1.看是否能行成飞机
		//2.看是否能形成连对
		//3.看是否能形成连子
		let cardLevel = this.handCardsSetArray[index];
		let has = false;
		let jumpIndex = 0;
		if(this.handCountArray[3][cardLevel] && 
			this.handCountArray[3][cardLevel+1]){
			has = true;
			jumpIndex = 0;
			this.mDispose.push(this.handCardsArray[cardLevel]);
            this.mFeiJi.push(this.handCardsArray[cardLevel]);
			do{
				jumpIndex ++;
				if(this.handCountArray[3][cardLevel+jumpIndex]){
					this.mDispose.push(this.handCardsArray[cardLevel+jumpIndex]);
                    this.mFeiJi.push(this.handCardsArray[cardLevel+jumpIndex]);
				}
			}while(this.handCountArray[3][cardLevel+jumpIndex]);
		}else
		if(this.handCountArray[2][cardLevel] && 
			this.handCountArray[2][cardLevel+1] && 
			this.handCountArray[2][cardLevel+2]){
			has = true;
			this.mDispose.push(this.handCardsArray[cardLevel]);
            this.mLianDui.push(this.handCardsArray[cardLevel]);
			jumpIndex = 0;
			do{
				jumpIndex ++;
				if(this.handCountArray[2][cardLevel+jumpIndex]){
					this.mDispose.push(this.handCardsArray[cardLevel+jumpIndex]);
                    this.mLianDui.push(this.handCardsArray[cardLevel+jumpIndex]);
				}
			}while(this.handCountArray[2][cardLevel+jumpIndex]);
		}else
		if(this.handCountArray[1][cardLevel] && 
			this.handCountArray[1][cardLevel+1] &&
			this.handCountArray[1][cardLevel+2] &&
			this.handCountArray[1][cardLevel+3] && 
			this.handCountArray[1][cardLevel+4]){
			has = true;
			this.mDispose.push(this.handCardsArray[cardLevel]);
            this.mShunZi.push(this.handCardsArray[cardLevel]);
			jumpIndex = 0;
			do{
				jumpIndex ++;
				if(this.handCountArray[1][cardLevel+jumpIndex]){
					this.mDispose.push(this.handCardsArray[cardLevel+jumpIndex]);
                    this.mShunZi.push(this.handCardsArray[cardLevel+jumpIndex]);
				}
			}while(this.handCountArray[1][cardLevel+jumpIndex]);
		}

		if(has){
			index += jumpIndex;
		}else{
			if(this.handCountArray[4][cardLevel]){
				this.mZhaDan.push(this.handCardsArray[cardLevel])
			}else
			if(this.handCountArray[3][cardLevel]){
				this.mSanZhang.push(this.handCardsArray[cardLevel])
			}else
			if(this.handCountArray[2][cardLevel]){
				this.mDuiZi.push(this.handCardsArray[cardLevel])
			}else
			if(this.handCountArray[1][cardLevel]){
				this.mDanZhang.push(this.handCardsArray[cardLevel])
			}
			index++;
		}
		return index;
	}
	dealHandCards(){
		let count = this.handCardsSetArray.length;
		var index = 0;
		do{
			index = this.checkCardIsRelate(index);
	 	}while(index < count);
	}
	conversionArrayToClientInfo(arr){
		let handCountArray = JSON.parse(JSON.stringify(emptyArray));
		let handCardsArray = [];
		let handCardsSet   = new Set();
		arr.forEach(element => {
            let card = new Card(element);
            handCountArray[0][card.level]++;
            if(!handCardsArray[card.level]){
            	handCardsArray[card.level] = [];
            }
            handCardsArray[card.level].push(card);
            handCardsSet.add(card.level);
        });
	    for (let i = 3; i <= 17; ++i) {
	        for (let j = 4; j >= 1; --j){
	            if (handCountArray[0][i] >= j) {
	                handCountArray[j][i] = handCountArray[0][i];
	            } else {
	                handCountArray[j][i] = 0;
	            }
	        }
	    }
	    return {handCountArray:handCountArray,handCardsArray : handCardsArray,handCardsSet : handCardsSet};
	}
	getCMain(N){
		for (let i of this.handCardsSetArray){
			if(this.handCountArray[N][i] >= N) return i;
		}
	}
	is_N_Zhang(N){
		if(this.serverCardArray.length === N && this.handCardsSetArray.length === 1)return true;
		return false;
	}
	is_Dan_Zhang(){
		return this.is_N_Zhang(1);
	}
	is_Yi_Dui(){
		return this.is_N_Zhang(2);
	}
	is_San_Bu_Dai(){
		return this.is_N_Zhang(3);
	}
	is_Zha_Dan(){
		return this.is_N_Zhang(4);
	}
	is_Wang_Zha(){
		if(this.handCardsSetArray.length === 2 && this.serverCardArray.length === 2){
			if(this.handCardsArray[kCard_ValueJoker1].length === 1 && 
			this.handCardsArray[kCard_ValueJoker2].length === 1)return true;
		}
		return false;
	}
	is_Shun_Zi(){
		return this.is_FLS(1);
	}
	is_Lian_Dui(){
		return this.is_FLS(2);
	}
	is_Fei_Ji_Bu_Dai(){
		return this.is_FLS(3);
	}
	is_FLS(N){
		let per = null;
    	for (let item of this.handCardsSetArray){
    		if(item>= kCard_Value2)return false;
            if(this.handCountArray[N][item] !== N)return false;
    		if(per === null){
    			per = item;
    		}else{
    			if(item - per === 1){
    				per = item;
    			}else{
    				return false;
    			}
    		}
    	}
		if(N === 1){ //连子
	        if(this.serverCardArray.length >= 5 && this.handCardsSetArray.length === this.serverCardArray.length/1 ){
				return true;
			}
	    }else if(N === 2){ //连对
	        if(this.serverCardArray.length >= 6 && this.handCardsSetArray.length === this.serverCardArray.length/2 ){
	        	return true;
	        }
	    }else if(N > 2){ //飞机不带
	        if(this.serverCardArray.length >= 6 && this.handCardsSetArray.length === this.serverCardArray.length/3 ){
	        	return true;
	        }
	    }
	    return false;
	}
	is_M_Dai_NC(M,N,C){
	    let per1 = 0,per2 = 0,has = false;
	    this.handCardsArray.forEach(element => {
	    	let bHas = true;
	        if (element.length === M) {
	            has = true;
	            bHas = false;
	            per1++;
	        }
			if(bHas){
	            if (element.length === C) {
	                per2++;
	            }
	            if (element.length === 2*C) {
	                per2+=2;
	            }
	        }

	    });
	    return M === 3 ?
	    (has && per1=== 1 && per2 === N) :
	    (has && per1=== 1 && per2 === N) || (has && per1=== N)
	}
	is_San_Dai_Yi(){
		return this.is_M_Dai_NC(3,1,1);
	}
	is_San_Dai_Er(){
		return this.is_M_Dai_NC(3,1,2);
	}
	is_Si_Dai_Er(){
		return this.is_M_Dai_NC(4,2,1);
	}
	is_Si_Dai_Er_Dui(){
		return this.is_M_Dai_NC(4,2,2);
	}
	is_N_Fei_C(N,C){
	    let count = 0;
	    let count_two = 0;
	    let per = null;
	    this.handCardsArray.forEach(element => {
	        if ( C === 1?element.length >= 3:element.length === 3) {
	            if(kCard_Value2 > element[0].level){
	                if(per){
	                    if(Math.abs(element[0].level - per) === 1 ){
	                        count++;
	                        per = element[0].level;
	                    }else{
	                        per = element[0].level
	                    }
	                }else{
	                    per = element[0].level;
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
	    return C===1 ?(count === N ):(count === N && count_two === N);
	}
	is_Fei_Ji_Dai_Zhang(){
		let N = this.serverCardArray.length/4;
		return this.is_N_Fei_C(N,1);
	}
	is_Fei_Ji_Dai_Dui(){
		let N = this.serverCardArray.length/5;
		return this.is_N_Fei_C(N,2);
	}
	getCardType(){
	    var ret = {}
	    let count = this.serverCardArray.length;
        ret.cCount = count;
        if (count >= 5) {
            if (this.is_Shun_Zi()) {
                ret.cType = CardType.Shun_Zi;
                ret.cMain = this.getCMain(1);
                ret.cSeral = count;
                ret.cSub = 1;
                return ret
            }
        }
        if(count >= 6 && count%2 === 0){
        	if (this.is_Lian_Dui()) {
                ret.cType = CardType.Lian_Dui;
                ret.cMain = this.getCMain(2);
                ret.cSeral = count/2;
                ret.cSub = 2;
                return ret
            }
        }
        switch (count) {
            case 1:
                ret.cType = CardType.Dan_Zhang;
                ret.cMain = this.getCMain(1);
                ret.cSeral = 1;
                ret.cSub = 1;
                return ret
                break;
            case 2:
                if (this.is_Wang_Zha()) {
                    ret.cType = CardType.Wang_Zha;
                    ret.cMain = this.getCMain(1);
                    ret.cSeral = 1;
                    ret.score = 10000;
                    ret.cSub = 1;
                    return ret
                }
                if (this.is_Yi_Dui()) {
                    ret.cType = CardType.Yi_Dui;
                    ret.cMain = this.getCMain(2);
                    ret.cSeral = 1;
                    ret.cSub = 2;
                    return ret
                }
                break;
            case 3:
                if (this.is_San_Bu_Dai()) {
                    ret.cType = CardType.San_Bu_Dai;
                    ret.cMain = this.getCMain(3);
                    ret.cSeral = 1;
                    ret.cSub = 3;
                    return ret
                }
                break;
            case 4:
                if (this.is_Zha_Dan()) {
                    ret.cType = CardType.Zha_Dan;
                    ret.cMain = this.getCMain(4);
                    ret.cSeral = 1;
                    ret.cSub = 4;
                    return ret
                }
                if (this.is_San_Dai_Yi()) {
                    ret.cType = CardType.San_Dai_Yi;
                    ret.cMain = this.getCMain(3);
                    ret.cSeral = 1;
                    ret.cSub = 3;
                    return ret
                }
                break;
            case 5:
                if (this.is_San_Dai_Er()) {
                    ret.cType = CardType.San_Dai_Er;
                    ret.cMain = this.getCMain(3);
                    ret.cSeral = 1;
                    ret.cSub = 3;
                    return ret
                }
                break;
            case 6:
                if (this.is_Si_Dai_Er()) {
                    ret.cType = CardType.Si_Dai_Er;
                    ret.cMain = this.getCMain(4);
                    ret.cSeral = 1;
                    ret.cSub = 4;
                    return ret
                }
                if (this.is_Fei_Ji_Bu_Dai()) {
                    ret.cType = CardType.Fei_Ji_Bu_Dai;
                    ret.cMain = this.getCMain(3);
                    ret.cSeral = 2;
                    ret.ext = 2;
                    ret.cSub = 3;
                    return ret
                }
                break;
            case 7:
                break;
            case 8:
                if (this.is_Si_Dai_Er_Dui()) {
                    ret.cType = CardType.Si_Dai_Er_Dui;
                    ret.cMain = this.getCMain(4);
                    ret.cSeral = 1;
                    ret.cSub = 4;
                    return ret
                }
                if (this.is_Fei_Ji_Dai_Zhang()) {
                    ret.cType = CardType.Fei_Ji_Dai_Zhang;
                    ret.cMain = this.getCMain(3);
                    ret.cSeral = 2;
                    ret.ext = 2;
                    ret.cSub = 3;
                    return ret
                }
                break;
            case 9:
                if (this.is_Fei_Ji_Bu_Dai()) {
                    ret.cType = CardType.Fei_Ji_Bu_Dai;
                    ret.cMain = this.getCMain(3);
                    ret.cSeral = 3;
                    ret.ext = 3;
                    ret.cSub = 3;
                    return ret
                }
                break;
            case 10:
                if (this.is_Fei_Ji_Dai_Dui()) {
                    ret.cType = CardType.Fei_Ji_Dai_Dui;
                    ret.cMain = this.getCMain(3);
                    ret.cSeral = 2;
                    ret.ext = 2;
                    ret.cSub = 3;
                    return ret
                }
                break;
            case 11:
                break;
            case 12:
                if (this.is_Fei_Ji_Bu_Dai()) {
                    ret.cType = CardType.Fei_Ji_Bu_Dai;
                    ret.cMain = this.getCMain(3);
                    ret.cSeral = 4;
                    ret.ext = 4;
                    ret.cSub = 3;
                    return ret
                }
                if (this.is_Fei_Ji_Dai_Zhang()) {
                    ret.cType = CardType.Fei_Ji_Dai_Zhang;
                    ret.cMain = this.getCMain(3);
                    ret.cSeral = 3;
                    ret.ext = 3;
                    ret.cSub = 3;
                    return ret
                }
                break;
            case 13:
                break;
            case 14:
                break;
            case 15:
                if (this.is_Fei_Ji_Bu_Dai()) {
                    ret.cType = CardType.Fei_Ji_Bu_Dai;
                    ret.cMain = this.getCMain(3);
                    ret.cSeral = 5;
                    ret.ext = 5;
                    ret.cSub = 3;
                    return ret
                }
                if (this.is_Fei_Ji_Dai_Dui()) {
                    ret.cType = CardType.Fei_Ji_Dai_Dui;
                    ret.cMain = this.getCMain(3);
                    ret.cSeral = 3;
                    ret.ext = 3;
                    ret.cSub = 3;
                    return ret
                }
                break;
            case 16:
                if (this.is_Fei_Ji_Dai_Zhang()) {
                    ret.cType = CardType.Fei_Ji_Dai_Zhang;
                    ret.cMain = this.getCMain(3);
                    ret.cSeral = 4;
                    ret.ext = 4;
                    ret.cSub = 3;
                    return ret
                }
                break;
            case 17:
                break;
            case 18:
                if (this.is_Fei_Ji_Bu_Dai()) {
                    ret.cType = CardType.Fei_Ji_Bu_Dai;
                    ret.cMain = this.getCMain(3);
                    ret.cSeral = 6;
                    ret.ext = 6;
                    ret.cSub = 3;
                    return ret
                }
                break;
            case 19:
                break;
            case 20:
                if (this.is_Fei_Ji_Dai_Dui()) {
                    ret.cType = CardType.Fei_Ji_Dai_Dui;
                    ret.cMain = this.getCMain(3);
                    ret.cSeral = 4;
                    ret.ext = 4;
                    ret.cSub = 3;
                    return ret
                }
                if (this.is_Fei_Ji_Dai_Zhang()) {
                    ret.cType = CardType.Fei_Ji_Dai_Zhang;
                    ret.cMain = this.getCMain(3);
                    ret.cSeral = 5;
                    ret.ext = 5;
                    ret.cSub = 3;
                    return ret
                }
                break;
            default:
                break;
        }
	    ret.cType = CardType.Undefine;
	    return ret
	}
}
// a=b return 0(需要判断等级) else 看是否王炸 炸弹 1(a>b不用考虑可以直接使用) -1(a<b 不用考虑要不起)
function compareCType(aType,bType){
    if (aType != bType) {
        if (aType === CardType.Wang_Zha) {
            return 1;
        }
        if (bType === CardType.Wang_Zha) {
            return -1;
        }
        if (aType === CardType.Zha_Dan) {
            return 1;
        }
        if (bType === CardType.Zha_Dan) {
            return -1;
        }
        //飞机不带 4X3 与飞机带单 3*4 牌型不同但可以要
        if (aType == CardType.Fei_Ji_Bu_Dai && bType == CardType.Fei_Ji_Dai_Zhang) {
            return 0;
        }
        return -1;
    } else {
        return 0;
    }
}

//a>b return true else return false
function compareCards(aCards,bCards){
    let a = new HandCards(aCards);
    let b = new HandCards(bCards);
    // console.log(a.handCardsSetArray);
    // console.log(b.handCardsSetArray);
    let aType = a.getCardType();
    let bType = b.getCardType();
    // console.log("a b Type=",aType,bType);
    let c = compareCType(aType.cType,bType.cType);
    // console.log("c",c);
    if(c >= 1){
        return true;
    } else if (c=== 0){
        return aType.cCount === bType.cCount && aType.cMain > bType.cMain;
    }
    return false;
}

//从a中排除b中的牌找c（单、对）
function findSubCards(a,b,c){
    //是否包含一张牌
    var isContainsCard = function(cards, card) {
        for (let i = 0; i < cards.length; i++) {
            if (cards[i] == card) {
                return true;
            }
        }
        return false;
    }
    let list = [];
    let ret = [];
    a.handCardsArray.forEach(element => {
        if (element.length >= c) {
            let isAdd = true;
            for(let i=0;i<element.length;i++){
                if (isContainsCard(b, element[i].num)) {
                    isAdd = false;
                }
            }
            if(isAdd)list.push(element);
        }
    });
    for(let i=0;i<list.length;i++){
        let l1 = [];
        let l2 = [];
        let isSec = list[i].length >= 2*c;
        for(let k=0;k<list[i].length;k++){
            if(k>=c && isSec){
                l2.push(list[i][k].num);
            }
            if(k<c){
                l1.push(list[i][k].num);
            }
        }
        ret.push(l1);
        if(isSec)ret.push(l2);
    }
    return ret
}

//从a中找比b大的牌型组合
function findListCards(aCards,bCards){
    let a = new HandCards(aCards);
    let b = new HandCards(bCards);
    console.log(a.handCardsSetArray);
    console.log(b.handCardsSetArray);
    let bType = b.getCardType();
    console.log("b Type=",bType);
    let ret = [];
    if (bType.cType === CardType.Wang_Zha)return ret;
    if(aCards.length >= bCards.length){
        if(bType.cType !== CardType.Wang_Zha){
            let _main = bType.cMain
            let _sub = bType.cSub
            let _seral = bType.cSeral
            var count = a.handCardsSetArray.length;
            var index = 0;
            do{
                let card = a.handCardsSetArray[index];
                if(card > _main){
                    if(a.handCountArray[_sub][card]){
                        let isAdd = true;
                        let list = [];
                        for (var k = 0; k < _sub; k++) {
                            list.push(a.handCardsArray[card][k].num);
                        }

                        for(var j = 1;j < _seral;j++){
                            if(a.handCountArray[_sub][card+j]){
                                for (var k = 0; k < _sub; k++) {
                                    list.push(a.handCardsArray[card+j][k].num);
                                }
                            }else{
                                isAdd = false; 
                            }
                        }
                        if(isAdd){
                            if(bType.cType === CardType.San_Dai_Yi||
                                bType.cType === CardType.Si_Dai_Er||
                                bType.cType === CardType.Fei_Ji_Dai_Zhang){
                                var subCards = findSubCards(a,list,1);
                                if(subCards.length >=_seral){
                                    list.push(subCards);
                                }else{
                                    isAdd = false
                                }
                            }
                            if(bType.cType === CardType.San_Dai_Er ||
                                bType.cType === CardType.Si_Dai_Er_Dui||
                                bType.cType === CardType.Fei_Ji_Dai_Dui){
                                var subCards = findSubCards(a,list,2);
                                if(subCards.length >=_seral){
                                    list.push(subCards);
                                }else{
                                    isAdd = false
                                }
                            }
                        }
                        if(isAdd)ret.push(list);
                    }
                }
                index++;
            }while(index <= (count - _seral));
        }
    }
    let bCMain = 0;
    if(bType.cType === CardType.Zha_Dan){
        bCMain = bType.cMain;
    }
    //自己的炸弹
    for (let i of a.handCardsSetArray){
        if(a.handCountArray[4][i] >= 4 && i > bCMain){
            let list = [];
            for (let j = 0; j < 4; j++) {
                list.push(a.handCardsArray[i][j].num);
            }
            ret.push(list);
        }
    }
    //是否有王炸
    if (a.handCountArray[1][kCard_ValueJoker1] && a.handCountArray[1][kCard_ValueJoker2]) {
        let list = [];
        list.push(a.handCardsArray[kCard_ValueJoker1][0].num);
        list.push(a.handCardsArray[kCard_ValueJoker2][0].num);
        ret.push(list);
    }
    return ret;
}

// var handCards = new HandCards([54,55,56,9,10,11]);
// var handCards = new HandCards([54,55,56,6,7,8]);
var handCards = new HandCards([3,4,5,6,7,8,9,10,10,10,11,11,11,13,1,1,12]);

console.log(JSON.stringify(handCards.handCountArray));
console.log(handCards.handCardsArray);
console.log(handCards.handCardsSetArray);
console.time("=====time");
console.log(handCards.is_Si_Dai_Er());
console.log(handCards.getCardType());
console.timeEnd("=====time");
console.log(handCards);
console.log(handCards.mDanZhang);


var mySet = new Set([1, 5, 3,"ddd"]);
console.log(mySet.size);
mySet.add(7)
for (let item of mySet.keys()) console.log(item);
for (let item of mySet.values()) console.log(item);
for (let [key, value] of mySet.entries()) console.log(key,value);
let arr = Array.from(mySet).sort((a,b)=>{return a>b});
for (let i of arr){
	console.log("==",i);
}
var myArr = Array.from(mySet);
console.log(myArr.sort((a,b)=>{return a>b}));
console.log(myArr[2]);
for (let i of myArr){
    console.log("--",i);
}

let list = [ 9, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14 ].sort((a,b)=>{if (a === b) {return b - a;} else {return a - b;}})
console.log(list);
console.log(list[0]);

var BC = [3];
var AC = [4];
console.log("A > B danzhang: ",compareCards(AC,BC));
var BC = [3,3];
var AC = [4,4];
console.log("A > B duizi: ",compareCards(AC,BC));
var BC = [3,3,3];
var AC = [4,4,4];
console.log("A > B : san",compareCards(AC,BC));
var BC = [3,3,3,3];
var AC = [4,4,4,4];
console.log("A > B : zhadan",compareCards(AC,BC));
var BC = [3,4,5,6,7];
var AC = [4,5,6,7,8];
console.log("A > B : shunzi",compareCards(AC,BC));
var BC = [3,3,4,4,5,5];
var AC = [4,4,5,5,6,6];
console.log("A > B : laindui",compareCards(AC,BC));
var BC = [3,3,3,6];
var AC = [4,4,4,8];
console.log("A > B : sandaiyi",compareCards(AC,BC));
var BC = [3,3,3,6,6];
var AC = [4,4,4,5,5];
console.log("A > B : sandaier",compareCards(AC,BC));
var BC = [3,3,3,3,5,6];
var AC = [4,4,4,4,7,8];
console.log("A > B : sidaiyi",compareCards(AC,BC));
var BC = [3,3,3,3,5,6,5,6];
var AC = [4,4,4,4,7,8,7,8];
console.log("A > B : sidaier",compareCards(AC,BC));
var BC = [3,3,3,4,4,4];
var AC = [5,5,5,6,6,6];
console.log("A > B : feiji",compareCards(AC,BC));
var BC = [3,3,3,4,4,4,5,6];
var AC = [5,5,5,4,6,6,6,8];
console.log("A > B : feijiyi",compareCards(AC,BC));
var BC = [3,3,3,4,4,4,5,6,5,6];
var AC = [5,5,5,6,6,6,8,8,9,9];
console.log("A > B : feijier",compareCards(AC,BC));
var BC = [3,3,3,4,4,4,5,6,5,6,5,7];
var AC = [11,10,10,9,10,8,8,8,9,9,11,11];
console.log("A > B : feijite",compareCards(AC,BC));
var BC = [3,3,3,4,4,4,5,6,5,6,5,7];
var AC = [14,15];
console.log("A > B : czha",compareCards(AC,BC));

console.time("===================findListCards");
var AC = [3,3,3,4,4,4,3,5,6,5,6,5,7,8,9,14,15];
var BC = [3,3,3,5,5];
console.log("A find B : list",JSON.stringify(findListCards(AC,BC)));
console.timeEnd("===================findListCards");


if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.lastIndexOf(searchString, position) === position;
    };
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        if (typeof position === 'undefined' || position > this.length) {
            position = this.length;
        }
        position -= searchString.length;
        var lastIndex = this.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}
