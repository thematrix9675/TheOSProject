var mouseDown=false;
var mouse=[0,0];
document.addEventListener("mousemove",function(e){
	mouse=[e.x,e.y];
	triggeredEvent="mouseMove"
	EventHandler(mouse[0],mouse[1]);
	e.preventDefault();
},true);
document.addEventListener("mousedown",function(e){
	mouseDown=true;
	triggeredEvent="mouseDown"
	EventHandler(mouse[0],mouse[1]);
	e.preventDefault();
},true);
document.addEventListener("mouseup",function(e){
	mouseDown=false;
	triggeredEvent="mouseUp"
	EventHandler(mouse[0],mouse[1]);
	e.preventDefault();
},true);
document.addEventListener("contextmenu",function(e){
	triggeredEvent="returnKey"
	EventHandler(mouse[0],mouse[1]);
	e.preventDefault();
},true);
function inRange(i,s,b){
	return i&&i>=s&&i<=b;
}
function inRect(p,r){
	return inRange(p[0]||p.x,(r[0]||r.x),(r[0]||r.x)+(r[2]||r.w))&&inRange(p[1]||p.y,(r[1]||r.y),(r[1]||r.y)+(r[3]||r.h))
}
function mouseOver(x,y,w,h){
	if(typeof x=='object'){
		y=x[1]||x.y;
		w=x[2]||x.w;
		h=x[3]||x.h;
		x=x[0]||x.x;
	}
	x=tonumber(x)
	y=tonumber(y)
	w=tonumber(w)
	h=tonumber(h)
	return inRect(mouse,typeof x=='object'&&x||[x,y,w,h]);
}
