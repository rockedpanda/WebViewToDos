# Simple Todo-List in QWebView 简单的QWebView实用举例,通过QWebView实现一个任务提醒小工具,Qt5开发.##使用说明* 本工具用于测试QWebView的使用,包括浏览器的设置,JS对象的注入,双向调用和访问* 工具的实用功能是按时间进行的任务列表提醒,属于简化版的todolist功能* 仅作为QWebView的使用和JS的调用学习,可使用版本中version3的版本,最简. 后续版本增加了bootstrap前端框架和必要的文件读取写入功能等附属功能.##当前功能* 页面上输入框中直接输入新任务即可  可以是通常字符串,也可以是带有 内容@1530 格式的字符串,@为分隔符,1530表示在当天15:30分弹出提醒* 提醒内容为具体的任务内容.支持同时提醒多个* 支持增加任务后的自动保存* 支持任务的时间展示##后续修改点* 任务处理后的保存* 用户操作: 延迟数分钟提醒, 改日提醒等* 默认延迟未完成的任务,每10分钟提醒一次