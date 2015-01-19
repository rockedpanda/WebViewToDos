$(document).ready(function(){
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
	lastData.off = true;
	$("#popChoice").hide();
	showList();
	initAlerts();
}
function set5min(){
	lastData.off = false;
	lastData.t = lastData.t + "5min";
	$("#popChoice").hide();
	showList();
	initAlerts();
}
function set15min(){
	lastData.off = true;
	$("#popChoice").hide();
	showList();
	initAlerts();
}
function setTomorrow(){
	lastData.off = true;
	$("#popChoice").hide();
	showList();
	initAlerts();
}
/* 页面的数据存储
 * 数据格式: [{'id':1,'title':'AAAAAAAAAAAAAAAA','t':'1501161057', off:true}]
 */
var datas = [];

/* 页面上增加一条新记录的方法
 * 可以是通常字符串,也可以是带有 内容@1530 格式的字符串,@为分隔符,1530表示在当天15:30分弹出提醒
 */
function add(){
	var text = $("#inputNewTodo").val();
	if(text.indexOf("@") != -1){
		addNew(text);
	}
	else{
		datas.push({title: text, t:0, off:true});
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
	$("#datasList").append(datas.sort(function(a,b){return a.off==true;}).reverse().map(function(x,i){
		var offStr = '';//'<li class="off list-group-item" id="list_'+i+'">'+x.title+'</li>';
		var onStr  = '<li class="list-group-item" id="list_'+i+'"><span class="time">'+getShownTimeByT(x.t)+'</span>'+x.title+'</li>';
		return x.off ? offStr: onStr;
	}).join(""));
	$('#datasList').click(function(evt){
		dealTarget(evt.target.id);
	});
}

/* */
function dealTarget(domId){
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
	var first = $.grep(datas,function(x){
		return !x.off;
	}).map(function(x){
		return x.t;
	}).sort();
	if(first.length > 0){
		var tmp = first[0];
		var id= tmp;

		console.log(tmp);
		var nextAlertTime = new Date();
		nextAlertTime.setFullYear(
			parseInt('20'+tmp.substring(0,2),10),
			parseInt(tmp.substring(2,4),10)-1,
			parseInt(tmp.substring(4,6),10)
			);	
		nextAlertTime.setHours(parseInt(tmp.substring(6,8),10));	//设置 Date 对象中的小时 (0 ~ 23)。
		nextAlertTime.setMinutes(parseInt(tmp.substring(8,10),10));	//设置 Date 对象中的分钟 (0 ~ 59)。
		nextAlertTime.setSeconds(0);
		console.log('ssssssssss    '+(nextAlertTime.getTime()-(new Date()).getTime()));
		if((nextAlertTime.getTime()-(new Date()).getTime()) < 10){
			removeId(id);
			initAlerts();
			return;
		}
		setTimeout(function(){
			removeId(id);
			//notifyMe(tmp);
			addAlert(getTitlesByT(tmp),0);
			initAlerts();
		}, nextAlertTime.getTime()-(new Date()).getTime());
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
		if(datas[i].t == t){
			datas[i].off = true;
			//datas.splice(i,1);
			return;
		}
	}
}

/* 格式化输出一个时间 */
function getShownTimeByT(t){
	t = "" +t;
	return t.substr(-4,2)+":"+t.substr(-2);
}

////更新数据的获取和存储格式为mongodb,单独建立一个本地服务用于数据的查询和返回,采用http方式交互

////本地文件方式存储
/* 更新本地数据文件,文件名固定为todos.db.txt */
function wirteFile(){
	if('win' in window){
		win.setFileContent("todos.db.txt", JSON.stringify(datas));
	}
}

/* 读取本地数据内容,文件名固定为todos.db.txt */
function readFile(){
	if('win' in window){
		return win.getFileContent("todos.db.txt");	
	}
	return "[]";
}

