onresize=function(){
	console.log("Resize In Progress")
	WW=innerWidth-5;
	WH=innerHeight-5;
	canvas.width=WW;
	canvas.height=WH;
	triggeredEvent="resize";
	EventHandler();
}
