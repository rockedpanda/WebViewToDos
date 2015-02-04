/*** 时间日期处理函数 ***/
var dateTime = {
	time2str:function(timeObj, strType){
		strType = strType || 'yyyyMMddHHmm';
		var infos = {
			yyyy : timeObj.getFullYear()+"",
			yy : (timeObj.getFullYear()+"").substring(2),
			MM : this.fix2(timeObj.getMonth()+1),
			M : timeObj.getMonth()+ 1 +"",
			dd : this.fix2(timeObj.getDate()),
			d : timeObj.getDate(),
			HH : this.fix2(timeObj.getHours()),
			H : timeObj.getHours(),
			mm : this.fix2(timeObj.getMinutes()),
			m : timeObj.getMinutes()
		};
		for(var c in infos){
			//console.log(c+"---");
			strType = strType.replace(c,infos[c]);
		}
		//console.log(strType);
		return strType;
	},
	str2time:function(str){
		var tmp = this.fixStr(str); //这里要求所有的str格式均为201501091800的格式
		var timeObj = new Date();
		timeObj.setFullYear(
			parseInt(tmp.substring(0,4),10),
			parseInt(tmp.substring(4,6),10)-1,
			parseInt(tmp.substring(6,8),10)
			);	
		timeObj.setHours(parseInt(tmp.substring(8,10),10));	//设置 Date 对象中的小时 (0 ~ 23)。
		timeObj.setMinutes(parseInt(tmp.substring(10,12),10));	//设置 Date 对象中的分钟 (0 ~ 59)。
		timeObj.setSeconds(0);
		return timeObj;
	},
	fixStr:function(str){
		str = ""+str;
		var fixedStr;
		fixedStr = str.replace(/[^\d]/g,'');
		if(fixedStr.match(/20\d{12}/)){
			return fixedStr.substring(0,12);
		}
		else if(fixedStr.match(/20\d{10}/)){
			return fixedStr;
		}
		else if(fixedStr.match(/\d{10}/)){
			return '20'+fixedStr;
		}
		else if(fixedStr.length == 4){
			return this.time2str(new Date(), 'yyyyMMdd')+fixedStr;
		}
		return fixedStr;
	},
	fix2 : function(str){
		str = ""+str;
		if(str.length > 2){
			return str.substr(-2);
		}
		return "00".substr(0,2-str.length) + str;
	},
	getDealy5min:function(t,distence){
		distence = distence || 300;
		var curTime;
		if(t){
			curTime = this.str2time('20'+t).getTime();
		}
		else{
			curTime = (new Date()).getTime();			
		}
		var nextTime = new Date();
		nextTime.setTime(curTime + distence * 1000);
		//console.log("--" + this.time2str(nextTime,"yyMMddHHmm"));
		return this.time2str(nextTime,"yyMMddHHmm");
	},
	getNextTimeFromStr:function(t,distence){
		if(typeof distence == 'number'){
			return this.getDealy5min(t, distence);
		}
		distence = ""+distence;
		if(distence.match(/\d+s(ec)?$/)){
			return this.getDealy5min(t, parseInt(distence,10));
		}
		else if(distence.match(/\d+m(in)?$/)){
			return this.getDealy5min(t, parseInt(distence,10)*60);	
		}
		else if(distence.match(/\d+h(our(s)?)?$/)){
			return this.getDealy5min(t, parseInt(distence,10)*3600);	
		}
		else if(distence.match(/next day/)){
			return this.getDealy5min(t, 3600*24);
		}
		return this.getDealy5min(t, 300);
	}
};

/*
console.log('20150120' == dateTime.time2str(new Date(), 'yyyyMMdd'));
console.log('201501201532' == dateTime.time2str(new Date(), 'yyyyMMddHHmm'));
console.log('2015012015' == dateTime.time2str(new Date(), 'yyyyMMddHH'));
console.log('150120' == dateTime.time2str(new Date(), 'yyMMdd'));
console.log('15/01/20' == dateTime.time2str(new Date(), 'yy/MM/dd'));
console.log('15/1/20' == dateTime.time2str(new Date(), 'yy/M/d'));

console.log("----------------------------");

console.log(dateTime.fixStr(201510100101) == '201510100101');
console.log(dateTime.fixStr(1510100101) == '201510100101');
console.log(dateTime.fixStr('15/10/10 01:01') == '201510100101');
console.log(dateTime.fixStr('2015/10/10 01:01') == '201510100101');
console.log(dateTime.fixStr('2015/10/10 01:01:00') == '201510100101');
console.log(dateTime.fixStr('2015/10/10 01:01:00,000') == '201510100101');
console.log(dateTime.fixStr('01:01') == '201501200101');
console.log(dateTime.fixStr('0101') == '201501200101');


//console.log(dateTime.getDealy5min());

console.log(dateTime.getNextTimeFromStr('1501200101',60) == '1501200102');
console.log(dateTime.getNextTimeFromStr('1501200101',120) == '1501200103');
console.log(dateTime.getNextTimeFromStr('1501200101','60s') == '1501200102');
console.log(dateTime.getNextTimeFromStr('1501200101','120s') == '1501200103');
console.log(dateTime.getNextTimeFromStr('1501200101','10m') == '1501200111');
console.log(dateTime.getNextTimeFromStr('1501200101','10min') == '1501200111');
console.log(dateTime.getNextTimeFromStr('1501200101','1h') == '1501200201');
console.log(dateTime.getNextTimeFromStr('1501200101','next day') == '1501210101');

*/