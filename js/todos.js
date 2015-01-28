$(document).ready(function(){
	$('#datasList').click(function(evt){
		//console.log('deal target for click event.');
		var dataId = $(evt.target).attr("dataid");
		console.log(dataId + "  "+ evt.target.innerText);
		dealTarget(dataId);
	});

	$("#choice_ok").click(function(evt){
		setOK();
	});
	$("#choice_5min").click(function(evt){
		set5min();
	});
	$("#choice_15min").click(function(evt){
		set15min();
	});
	$("#choice_tomorrow").click(function(evt){
		setTomorrow();
	});
	datas = JSON.parse(readFile());
	initDatas();
	showList();
	initAlerts();
	$("#formNewTodo").submit(function(){
		add();
		return false;
	});
	$("#inputNewTodo").focus();

});

var lastData ={};
/* 用户操作的绑定 */
function setOK(){
	console.log(JSON.stringify(lastData));
	//return;
	lastData.off = true;
	$("#popChoice").hide();
	showList();
	initAlerts();
}
function set5min(){
	lastData.off = false;
	lastData.t = dateTime.getDealy5min(lastData.t, 300);
	$("#popChoice").hide();
	showList();
	initAlerts();
}
function set15min(){
	lastData.off = false;
	lastData.t = dateTime.getDealy5min(lastData.t, 900);
	$("#popChoice").hide();
	showList();
	initAlerts();
}
function setTomorrow(){
	lastData.off = false;
	lastData.t = dateTime.getDealy5min(lastData.t, 3600*20);
	$("#popChoice").hide();
	showList();
	initAlerts();
}
/* 页面的数据存储
 * 数据格式: [{'id':1,'title':'AAAAAAAAAAAAAAAA','t':'1501161057', off:true}]
 */
var datas = [];
var datasInfo = {
	size: 0,
	maxId: 0,
	creatId:function(){
		this.maxId = this.maxId +1;
		return this.maxId;
	},
	getIndexById:function(dataId){
		for(var i=0;i<datas.length;i++){
			if(datas[i].id == dataId){
				return i;
			}
		}
		return -1;
	}
};

/* */
function initDatas(){
	datasInfo.size = datas.length;
	datasInfo.maxId = Math.max.apply(null,datas.map(function(x){return x.id})) || 1;
}

/* 页面上增加一条新记录的方法
 * 可以是通常字符串,也可以是带有 内容@1530 格式的字符串,@为分隔符,1530表示在当天15:30分弹出提醒
 */
function add(){
	var text = $("#inputNewTodo").val();
	if(text.indexOf("@") != -1){
		addNew(text);
	}
	else{
		datas.push({title: text, t:'0', off:false, id:datasInfo.creatId()});
	}
	$("#inputNewTodo").val("").focus();
	showList();
	initAlerts();
	wirteFile();
}

/* 格式化数字为两个字符,长的截取,短的补0 */
function fix2(str){
	str = ""+str;
	if(str.length > 2){
		return str.substr(-2);
	}
	return "00".substr(0,2-str.length) + str;
}

/* 新增一个新的任务 */
function addNew(str){
	var t = {};
	var d = str.split("@");
	if(d[0] ==""){
		return;
	}
	t.title = d[0];
	t.id = datasInfo.creatId();
	if(d.length > 1){
		var timeToAlert = d[1];
		if(timeToAlert.length == 4){
			var today = new Date();

			timeToAlert = "15"+fix2(today.getMonth()+1)+fix2(today.getDate()) + timeToAlert;
		}
		t.t = timeToAlert;
	}
	datas.push(t);
}

/* 显示列表 */
function showList(){
	$("#datasList").html("");
	if(datas.length < 1){
		return;
	}
	var iconNumber = 0;
	$("#datasList").append(datas.sort(function(a,b){
		return (a.t > b.t|| (a.t == b.t && a.title>b.title))?-1:1;// ;
	}).map(function(x,i){
		var offStr = '';//'<li class="off list-group-item" dataid="'+i+'">'+x.title+'</li>';
		var onStr  = '<li class="list-group-item" dataid="'+x.id+'"><span class="time">'+getShownTimeByT(x.t)+'</span>'+x.title+'</li>';
		if(x.off !== true && x.t != '0'){  // && x.t != '0'
			iconNumber++;
		}
		return x.off===true ? offStr: onStr;
	}).join(""));

	win.setIconNumber(Math.min(iconNumber,6));
	//$('#datasList').click(function(evt){
	//	alert(evt.target.id);
	//});
}

/* 显示所有任务 */
function showAll(){
$("#datasList").html("");
	if(datas.length < 1){
		return;
	}
	$("#datasList").append(datas.sort(function(a,b){
		return (a.off < b.off || a.t > b.t|| (a.t == b.t && a.title>b.title))?-1:1;// ;
	}).map(function(x,i){
		var offStr = '';//'<li class="off list-group-item" id="list_'+i+'">'+x.title+'</li>';
		var onStr  = '<li class="list-group-item'+(x.off?" off":"")+'" id="list_'+i+'"><span class="time">'+getShownTimeByT(x.t)+'</span>'+x.title+'</li>';
		return onStr;
	}).join(""));	
}
/* */
function dealTarget(dataId){
	var index = datasInfo.getIndexById(dataId);
	if(index == -1){
		console.log("error index for "+index);
		return;
	}
	lastData = datas[index];
	$("#popChoice").show();
}

/* 向任务队列增加提醒 */
function addAlert(title, sec){
	if('win' in window && win.addAlert){
		win.addAlert(title,sec); //当前程序中的提醒功能
	}
	else{
		notifyMe(title);  //firefox和chrome下的提醒功能
	}
	return;
}

/* firefox和chrome下的提醒功能 */
function notifyMe(title) {
	if (!("Notification" in window)) {
		alert("This browser does not support desktop notification");
	}

	else if (Notification.permission === "granted") {
		var notification = new Notification(title);
	}

	else if (Notification.permission !== 'denied') {
		Notification.requestPermission(function (permission) {
			if (permission === "granted") {
				var notification = new Notification(title);
			}
		});
	}
}

/* 处理所有数据并更新下一个提醒的时间 */
function initAlerts(){
	var filtedData = $.grep(datas,function(x){
		return x.off !== true && x.t !== '0';
	}).sort(function(a,b){
		return a.t > b.t ? 1: -1;
	});
	if(filtedData.length == 0){
		console.log("no alert left.");
		return;
	}
	var first = filtedData[0].t;
	var id= filtedData[0].id;
	console.log(first);
	if(first.length > 0){
		var tmp = first;
		

		console.log(tmp);

		var nextAlertTime = new Date();  //dateTime.str2Time('20'+tmp);
		var nextMillinSeconds = 0;  //300s, 5min. 暂时不做提醒
		if(tmp !== '0'){
			nextAlertTime.setFullYear(
				parseInt('20'+tmp.substring(0,2),10),
				parseInt(tmp.substring(2,4),10)-1,
				parseInt(tmp.substring(4,6),10)
				);	
			nextAlertTime.setHours(parseInt(tmp.substring(6,8),10));	//设置 Date 对象中的小时 (0 ~ 23)。
			nextAlertTime.setMinutes(parseInt(tmp.substring(8,10),10));	//设置 Date 对象中的分钟 (0 ~ 59)。
			nextAlertTime.setSeconds(0);	
			nextMillinSeconds = nextAlertTime.getTime()-(new Date()).getTime();
		}
		
		console.log('下一个提醒:    '+ nextMillinSeconds/1000);
		if(nextMillinSeconds < 10000){   //小于10秒
			dealyById(id);
			initAlerts();
			return;
		}
		setTimeout(function(){
			dealyById(id);
			//notifyMe(tmp);
			addAlert(getTitlesByT(tmp),0);
			initAlerts();
		}, nextMillinSeconds);
	}
	else{
		console.log("no alerts left");
	}
}

/* 根据时间获取对应的任务内容 */
function getTitlesByT(t){
	return $.grep(datas,function(x){
		return x.t == t;
	}).map(function(x,i){
		return i+": "+x.title;
	}).join("\r\n");
}

/* 根据时间删除一个任务,将其标记为off状态 */
function removeId(t){
	var length = datas.length;
	for(var i=0;i<length;i++){
		if(datas[i].t == t && t != "0"){
			datas[i].off = true;
			//datas.splice(i,1);
			return;
		}
	}
}
/* 根据时间删除一个任务,将其标记为off状态 */
function removeById(id){
	var length = datas.length;
	for(var i=0;i<length;i++){
		if(datas[i].id == id){
			datas[i].off = true;
			//datas.splice(i,1);
			return;
		}
	}
}

/* 延迟一个任务 */
function dealyById(id){
	var length = datas.length;
	for(var i=0;i<length;i++){
		if(datas[i].id == id){
			datas[i].off = false;
			datas[i].t = dateTime.getDealy5min();
			//datas.splice(i,1);
			return;
		}
	}
}

/* 格式化输出一个时间 */
function getShownTimeByT(t){
	t = "" +t;
	if(t == "0"){
		return '持续   ';
	}
	return t.substr(-4,2)+":"+t.substr(-2);
}

////更新数据的获取和存储格式为mongodb,单独建立一个本地服务用于数据的查询和返回,采用http方式交互

////本地文件方式存储
/* 更新本地数据文件,文件名固定为todos.db.txt */
function wirteFile(){
	if('win' in window){
		win.setFileContent("todos.db.txt", JSON.stringify(datas,null,2));
	}
}

/* 读取本地数据内容,文件名固定为todos.db.txt */
function readFile(){
	if('win' in window){
		return win.getFileContent("todos.db.txt");	
	}
	return "[]";
}

