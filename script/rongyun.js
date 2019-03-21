
var qundatas = '';
function initRongYun(type) {
	//	alert($api.jsonToStr($api.getStorage('loginDataInfo')));
	var jiaoLiuParam = $api.jsonToStr($api.getStorage('loginDataInfo'));
	if (!jiaoLiuParam || jiaoLiuParam == null || jiaoLiuParam == '') {
		alert("已登出");
		api.hideProgress();
		var jsfun = 'logout();';
		api.execScript({
			name : 'index',
			script : jsfun
		});
		return;
	}
	$.ajax({
		type : "POST",
		url : $api.getStorage('serverUrl') + "app_JiaoLiiu", //如果地址访问不到会请求出错，请填写自己的接口地址
		data : {
			jiaoLiuParam : jiaoLiuParam

		},
		dataType : 'json',
		cache : false,
		crossDomain : true,
		timeout : 5000,
		success : function(data) {
			pingBiMap = new HashMap();
			var datas = data.data;
			qundatas = data.qundata;
			$api.setStorage('rongQunData', datas);
			$api.setStorage('rongBanQunData', qundatas);
			//						alert($api.jsonToStr(datas));
			//						alert($api.jsonToStr(qundatas));

			var pingBiList = data.pingBiList;
			if (pingBiList && pingBiList.length > 0) {
				var obj;
				for (var i = 0; i < pingBiList.length; i++) {
					obj = pingBiList[i];
					//					alert($api.jsonToStr(obj));
					if (obj.leiXing == '1') {
						pingBiMap.put(obj.rongId + obj.leiXing, obj);
					} else {
						pingBiMap.put(obj.rongId + obj.pingBiZhangHu, obj);
					}
				}
			}
			//$api.setStorage('pingBiMap', pingBiMap);
			if (data.retInfo == "fail") {
			} else {
				if (type == 'init') {
					//登录用户id
					var dataInfo = $api.getStorage('loginDataInfo');
					var xuexiaoXuehao = dataInfo.xuexiao_xuehao;

					var loginName = dataInfo.yongHuMing;
					var xuexiaoid = dataInfo.xueXiaoID;
					if (xuexiaoXuehao != null && xuexiaoXuehao != '') {
						if (xuexiaoid == null || xuexiaoid == '') {
							xuexiaoid = xuexiaoXuehao.split("_")[0];
						}
					} else {
						alert("已登出");
						api.hideProgress();
						var jsfun = 'logout();';
						api.execScript({
							name : 'index',
							script : jsfun
						});
						return;
					}
					var rongLoginId = xuexiaoid + "_" + loginName;
					//					var rongLoginId = xuexiaoXuehao;

					//登录姓名
					var name = dataInfo.xingMing;
					//头像
					var portraitUri = "../../res/qq.png";
					//会员头像
					var appKey = "e5t4ouvpe6q1a";
					var appSecret = "MQl1NXEWFzKV";
					//					var appKey = "e5t4ouvpe6q1a";
					//					var appSecret = "omqCQWUI2eyn";
					var nonce = Math.floor(Math.random() * 1000000);
					//随机数
					var timestamp = Date.now();
					//时间戳
					var signature = sha1("" + appSecret + nonce + timestamp);
					//数据签名(通过哈希加密计算)
					api.ajax({
						url : "http://api.cn.ronghub.com/user/getToken.json",
						method : "post",
						headers : {
							"RC-App-Key" : appKey,
							"RC-Nonce" : "" + nonce,
							"RC-Timestamp" : "" + timestamp,
							"RC-Signature" : "" + signature,
							"Content-Type" : "application/x-www-form-urlencoded"
						},
						data : {
							values : {
								userId : rongLoginId,
								name : name,
								portraitUri : portraitUri
							}
						}
					}, function(ret, err) {
						//									alert(JSON.stringify(ret) +"___"+ JSON.stringify(err));
						if (ret) {
							$api.setStorage('rongyuntoken', ret.token);
							$api.setStorage('zh', name);
							$api.setStorage('id', rongLoginId);
							$api.setStorage('tx', portraitUri);
							var rong = api.require('rongCloud2');
							//							alert(ret.token + "---"+  $api.getStorage('rongyuntoken'));
							if (rong) {
								rong.init(function(ret, err) {
									if (ret.status == 'success') {
										//消息监听
										jt();
										rong.connect({
											token : $api.getStorage('rongyuntoken')
										}, function(ret, err) {
											//											alert(ret.status)
											//												alert(JSON.stringify(ret) +"___"+ JSON.stringify(err));
											var dataInfo = $api.getStorage('loginDataInfo');
		                                    var status = dataInfo.status;
											if (ret.status == 'success') {
											
//											alert(status);
												if (status == 'fudaoyuan') {
												
													unreads(qundatas);
												} else if(status == 'xuesheng') {
													unread();
												} else if(status == 'laoshi') {
													unread();
												} else{
												}

												if (datas.length != 0) {
													//												alert($api.jsonToStr(datas));
													var obj;
													for (var i = 0; i < datas.length; i++) {
														obj = datas[i];
														rong.joinGroup({
															groupId : obj.id,
															groupName : obj.mingCheng
														}, function(ret, err) {
														})
														//														rong.clearMessages({
														//															conversationType : 'GROUP',
														//															targetId : obj.id
														//														}, function(ret, err) {
														//															api.toast({
														//																msg : ret.status
														//															});
														//														})
													}

												}
												if (qundatas) {
													//					unread();
													var obj;
													for (var i = 0; i < qundatas.length; i++) {
														obj = qundatas[i];
														rong.joinGroup({
															groupId : obj.id,
															groupName : obj.mingCheng
														}, function(ret, err) {
														})
													}
												}
											}
										});
									} else {
										//																				api.toast({
										//																					msg : '服务器连接失败'
										//																				});
									}
								});
							}
						} else {
							//							api.toast({
							//								msg : '获取token失败',
							//								duration : 3000,
							//								location : 'bottom'
							//							});
						}
					});
				}
				api.hideProgress();
			}
		},
		error : function() {
			alert("超时！！!");
			api.hideProgress();
		}
	});

}

// key为rongid + 类型 值为屏蔽账户 或者是空
function geiPingBiValue(key) {
	return pingBiMap.get(key);
}

function getPingBiValueToBlack(key, functionName, frameName) {
	var rongId = '';
	var pingBiZhangHu = '';
	var id = '';
	var leiXing = '';
	var obj = pingBiMap.get(key);
	if (obj) {
		rongId = obj.rongId;
		pingBiZhangHu = obj.pingBiZhangHu;
		id = obj.id;
		leiXing = obj.leiXing;
	}

	var jsfun = functionName + '("' + rongId + '","' + pingBiZhangHu + '","' + id + '","' + leiXing + '");';
	api.execScript({
		name : frameName,
		script : jsfun
	});
}

//融云消息监听器
function jt() {
	//	alert($api.jsonToStr(pingBiMap));
	var rong = api.require('rongCloud2');
	rong.setConnectionStatusListener(function(ret, err) {
		//api.toast({ msg: ret.result.connectionStatus });
		if (ret.result.connectionStatus == 'KICKED') {
			//			api.confirm({
			//				title : '掉线提醒',
			//				msg : '账号已经在其他设备登录',
			//				buttons : ['确定', '取消']
			//			}, function(ret, err) {
			//
			//			});
			logout();
			alert('账号在其他设备登录，退出登录');
		}
	});
	rong.setOnReceiveMessageListener(function(ret, err) {
		if (ret) {
			//		alert(JSON.stringify(ret));
			var pingBiKey = "";
			var conversationType = ret.result.message.conversationType;
			var senderUserId = ret.result.message.senderUserId;
			var targetId = ret.result.message.targetId;
			pingBiKey = targetId + senderUserId;
			var messageId = ret.result.message.messageId;
			//			alert(pingBiKey + "---" + targetId + "---" + senderUserId + "---" + geiPingBiValue(pingBiKey));
			if (conversationType == 'GROUP') {
				if (geiPingBiValue(pingBiKey) == null) {
					api.sendEvent({
						name : 'hhxx'
					});
					api.sendEvent({
						name : 'new_msg',
						extra : {
							msg : ret.result.message
						}
					})
				} else {
					// 之前调用 init 和 connect 的代码省略
					rong.deleteMessages({
						messageIds : [messageId]
					}, function(ret, err) {
						api.toast({
							msg : ret.status
						});
					})
				}
			} else {
				api.sendEvent({
					name : 'hhxx'
				});
				api.sendEvent({
					name : 'new_msg',
					extra : {
						msg : ret.result.message
					}
				})
			}

		}

	})
}

