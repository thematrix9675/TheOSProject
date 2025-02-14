function draw(){
	gc.setFont("sans-serif",10);
	triggeredEvent="timer";
	try{
		EventHandler();
	}catch(e){}
}
var __debug=false;
var __Debug=!true;
var __slow=true;
var timerID=setInterval(draw,__debug?100:__slow?20:10);