
var isPause = false;
function initJiGuang() {
	var dataInfo = $api.getStorage('loginDataInfo');
	var xueshengid = dataInfo.id;
	var banjiid = dataInfo.banJiID;
	var status = dataInfo.status;
	var xuexiaoXuehao = dataInfo.xuexiao_xuehao;
	var xuexiaoid = '';
	if(xuexiaoXuehao != null && xuexiaoXuehao != ''){
		xuexiaoid = xuexiaoXuehao.split("_")[0];
	}else{
		alert("已登出");
		api.hideProgress();
		var jsfun = 'logout();';
		api.execScript({
		    name: 'index',
		    script: jsfun
		});
		return;
	}
	
	
	var ajpush = api.require('ajpush');
	if (api) {
		if (ajpush) {
			var tags = [xuexiaoid + '_' + banjiid, xuexiaoid + '_' + status, xuexiaoid + '_xuesheng_laoshi'];
			if(status == 'laoshi'){
				tags = [xuexiaoid + '_' + status, xuexiaoid + '_xuesheng_laoshi'];
			}
			ajpush.isPushStopped(function(ret) {
				if (ret && ret.isStopped) {
					ajpush.resumePush(function(ret) {
						if (ret && ret.status) {
							//alert('恢复成功');
							ajpush.init(function(ret) {
								if (ret && ret.status) {
									var param = {
										//alias : '3333',
										alias : xuexiaoid + '_' + xueshengid,
										tags : tags
										//tags : ['test']
									};
									ajpush.bindAliasAndTags(param, function(ret) {
										//alert($api.jsonToStr(ret));
										//alert(xuexiaoid+'_'+xueshengid);
										var statusCode = ret.statusCode;
									});
								}
							});
						}
					});
				} else {
					ajpush.init(function(ret) {
						if (ret && ret.status) {
							var param = {
								//alias : '3333',
								alias : xuexiaoid + '_' + xueshengid,
								tags : tags
								//tags : ['test']
							};
							ajpush.bindAliasAndTags(param, function(ret) {
								//alert($api.jsonToStr(ret));
								//alert(xuexiaoid+'_'+xueshengid);
								var statusCode = ret.statusCode;
							});
						}
					});
				}
			});
			var timeOutObj = null;
			var closeTime = 60 * 1000 * 5;
			var time = "";
			api.addEventListener({
				name : 'pause'
			}, function(ret, err) {
				//var ajpush = api.require('ajpush');
				var date = new Date();
				time = date.getTime();
				isPause = true;
				ajpush.onPause();
				//实时刷新时间单位为毫秒
				timeOutObj = window.setTimeout(function(){closeWebSocket();},closeTime); 
			});
			
			api.addEventListener({
				name : 'resume'
			}, function(ret, err) {
				
				//var ajpush = api.require('ajpush');
				var date = new Date();
				//if(timeOutObj != null){
				//	window.clearTimeout(timeOutObj);//去掉定时器
				//	timeOutObj = null;
				//}
				
				if(time != ""){
					//alert(time);
					//alert(date.getTime() - time);
					if(date.getTime() - time > (closeTime)){
						if(ws != null){
							ws.close();
						}
						var jsfun = 'refreshWin();';
						api.execScript({
							name : 'root',
							script : jsfun
						});
					}
					
				}
				isPause = false;
				ajpush.onResume();
			});
			api.addEventListener({
				name : 'appintent'
			}, function(ret, err) {
				if (ret && ret.appParam.ajpush) {
					var ajpush = ret.appParam.ajpush;
					var id = ajpush.id;
					var title = ajpush.title;
					var content = ajpush.content;
					var extra = ajpush.extra;
					//alert('点击');
					//alert($api.jsonToStr(ret));
					showJiGuangMessager(ret.appParam.ajpush.extra);
					//alert($api.jsonToStr(ret));
				}
			})
			ajpush.setListener(function(ret) {
				if (!isPause) {
					var clearParam = {
						id : -1
					};
					ajpush.clearNotification(clearParam, function(ret) {
						if (ret && ret.status) {
							//alert($api.jsonToStr(ret));
							//success
						}
					});
//											var id = ret.id;
//											var title = ret.title;
//											var content = ret.content;
//											var extra = ret.extra;
				}
				shuaxin();
			});
		}
	}
}

function closeWebSocket(){
	if(ws != null){
		ws.close();
		ws = null;
	}
}