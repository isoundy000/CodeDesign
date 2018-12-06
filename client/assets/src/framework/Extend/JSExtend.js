// js原生扩展

/////////////////////////////////////////////////////////////
// Math function extend
/////////////////////////////////////////////////////////////

/*
*  Math.randomInt(min,max)
* @param min 最小值
* @param max 最大值
* return 随机min到max的值
*/
Math.randomInt = function(min,max){
	return parseInt(Math.random() * (max - min + 1)+ min,10);
}

/*
*  Math.randomStrings(n)
* @param n 位数
* return 随机n位数字字符串
*/
Math.randomStrings = function(n){
	let ret ='';
	for (var i = n - 1 ; i >= 0; i--) {
		let r = Math.floor(Math.random()*10);
		ret += r;
	}
	return ret;
}



/////////////////////////////////////////////////////////////
// js function extend
/////////////////////////////////////////////////////////////

/*
*  cc.js.andBit(num,bit)
* @param num 数字
* @param bit 位
* return bit位清零
*/
cc.js.subBit = function(num,bit){
	let sub = num & bit;
	return sub > 0 ? num - sub : num;
}

/*
*  cc.js.isFunction(func)
* @param func 函数
* return true false
*/
cc.js.isFunction = function(func){
	return func != null && typeof func === 'function';
}

/*
*  cc.js.isArray(arr)
* @param arr 数组
* return true false
*/
cc.js.isArray = function(arr){
	return arr != null && typeof arr instanceof Array;
}

/*
*  cc.js.isObject(obj)
* @param obj 对象 object
* return true false
*/
cc.js.isObject = function(obj){
	return obj != null && typeof obj === 'Object' && cc.js.isArray(obj);
}




