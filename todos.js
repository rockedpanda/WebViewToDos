$(document).ready(function(){
	datas = JSON.parse(readFile());
	showList();
	initAlerts();
	$("#formNewTodo").submit(function(){
		//alert($("#inputNewTodo").val());
		add();
		return false;
	});
	$("#inputNewTodo").focus();
});

function add(){
	var text = $("#inputNewTodo").val();
	if(text.indexOf("@") != -1){
		addNew(text);
	}
	else{
		datas.push({title: text, t:0, off:true});
	}
	showList();
	initAlerts();
}
var datas = [];
/*datas.push({'id':1,'title':'AAAAAAAAAAAAAAAA','t':'1501161057'});
datas.push({'id':2,'title':'BBBBBBBBBBBBBBB','t':'1501161058'});
datas.push({'id':4,'title':'CCCCCCCCCCCCC','t':'1501161130'});*/

function fix2(str){
	str = ""+str;
	if(str.length > 2){
		return str.substr(-2);
	}
	return "00".substr(0,2-str.length) + str;
}
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

function showList(){
	$("ul").html("").append(datas.sort(function(a,b){return a.off;}).map(function(x,i){
		return x.off?('<li class="off" id="list_'+i+'">'+x.title+'</li>'):('<li id="list_'+i+'">'+x.title+'</li>');
	}).join(""));
	$('ul').click(function(evt){
		alert(evt.target.id);
	});
}


function addAlert(title, sec){
	if('win' in window && win.addAlert){
		win.addAlert(title,sec);
	}
	else{
		notifyMe(title);
	}
	return;
}

function notifyMe(title) {
	
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
  	alert("This browser does not support desktop notification");
  }

  // Let's check if the user is okay to get some notification
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(title);
}

  // Otherwise, we need to ask the user for permission
  // Note, Chrome does not implement the permission static property
  // So we have to check for NOT 'denied' instead of 'default'
  else if (Notification.permission !== 'denied') {
  	Notification.requestPermission(function (permission) {
      // If the user is okay, let's create a notification
      if (permission === "granted") {
      	var notification = new Notification(title);
      }
  });
  }

  // At last, if the user already denied any notification, and you 
  // want to be respectful there is no need to bother them any more.
}


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
			addAlert(tmp,0);
			initAlerts();
		}, nextAlertTime.getTime()-(new Date()).getTime());
	}
	else{
		console.log("no alerts left");
	}
}

function removeId(id){
	var length = datas.length;
	for(var i=0;i<length;i++){
		if(datas[i].t == id){
			datas[i].off = true;
			//datas.splice(i,1);
			return;
		}
	}
}



////更新数据的获取和存储格式为mongodb,单独建立一个本地服务用于数据的查询和返回,采用http方式交互
////本地文件方式存储
function wirteFile(){
	win.setFileContent("todos.db.txt", JSON.stringify(datas));
}

function readFile(){
	return win.getFileContent("todos.db.txt");	
}