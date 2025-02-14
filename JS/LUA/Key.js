var keyDown={};
document.addEventListener("keyup",function(e){
	keyDown[e.key]=false;
	//e.preventDefault();
},true);
document.addEventListener("keydown",function(e){
	var i=e.key;
	keyDown[e.key]=true;
	if(i=="Escape"){
		triggeredEvent="escapeKey";
		EventHandler();
	}else if(i=="ArrowUp"||i=="ArrowDown"||i=="ArrowLeft"||i=="ArrowRight"){
		triggeredEvent="arrowKey";
		EventHandler(i);
	}else if(i=="Enter"){
		triggeredEvent="enterKey";
		EventHandler();
	}else if(i=="Control"){
		triggeredEvent="controlKey";
		EventHandler();
	}else if(i=="Tab"){
		triggeredEvent="tabKey";
		EventHandler();
		e.preventDefault();
	}else if(i=="Backspace"){
		triggeredEvent="backspaceKey";
		EventHandler();
	}else if(i=="Alt"){
		triggeredEvent="clearKey";
		EventHandler();
	}else{
		if(i!="Shift"){
			triggeredEvent="charIn";
			EventHandler(i);
		}
	}
	if(__Debug) print(i);
},true);
var delay=1;
function keydown(k,s){
	s=s||3;
	return keyDown[k]&&delay%s==1;
}
setInterval(function(){
	delay++;
},10);
