/**
 * 这个文件里定义和存储的是需要加载时自动执行的任务,
 * 任务自身是可以设置计时器实现循环执行和延时执行的
**/

/* 检查每日构建结果
 * 这里是自动任务的举例
 */
function checkJenkis(){
	$.get("http://192.168.2.34:8080/jenkins/api/json?pretty=true",function(data){
		jenkinsData = data ;
		if(typeof data == "string"){
			jenkinsData = JSON.parse(data);
		}
		var ans = true;
		if(jenkinsData.jobs.length >0 ){
			ans = jenkinsData.jobs.every(function(x){return x.color == "blue" || x.color == "disabled";});
		}
		console.log("check finished "+ (ans ? "success":"failed"));
		$("#autoRunInfos").text(ans?"自动任务正常":"自动任务异常").attr("title", ans?"自动任务正常":"自动任务异常").css("color", ans?"#9d9d9d":"red");
		
	});
}



/* 增加到自动执行队列中去 */
if("autoRunItems" in window){
	autoRunItems.add(checkJenkis, '持续构建检查');
}
else{
	window.autorunlist = window.autorunlist || [];
	window.autorunlist.push({
		'func': checkJenkis,
		'name': '持续构建检查'
	});
}

