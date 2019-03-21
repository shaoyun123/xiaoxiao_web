/**
 * map 对象实现
 * 实例:
 * var map = new HashMap();</br>
		map.put("zhangsan","HHHHHHHHHH");</br>
		alert(map.get("zhangsan"));</br>
		alert(map.length());</br>
		alert(map.remove("zhangsan"));</br>
		alert(map.length());</br>		
		alert(map.get("zhangsan"));</br>
 * @author zohan 
 * @memberOf {TypeName} 
 */
 function HashMap (){
		    this.count = -1;
			this.container = {};					
}
 
 
 		
/**
 * 对象存放
 * @param {Object} key
 * @param {Object} obj
 * @memberOf {TypeName} 
 */
HashMap.prototype.put = function (key,obj){
	if(!this.get(key)){
		this.count++;
	}
	this.container[key] = obj;
	
};
/**
 * 对象移除
 * @param {Object} key
 * @memberOf {TypeName} 
 */
HashMap.prototype.remove = function(key){
	if(this.get(key)){
		delete this.container[key];
		this.count --;
	}
};
/**
 * 对象的个数 
 * @memberOf {TypeName} 
 * @return {TypeName} 
 */
HashMap.prototype.length = function (){
	return this.count + 1;
};
/**
 * 获取对象
 * @param {Object} key
 * @memberOf {TypeName} 
 * @return {TypeName} 
 */
HashMap.prototype.get = function (key){
	return this.container[key];
};


HashMap.prototype.getArray = function (){
	return this.container;
};