var nil=null;
function print(a){
	for(var i=0;i<arguments.length;i++){
		console.log(arguments[i]);
	}
}
var platform={
	window:{
		invalidate:function(){
			var old=triggeredEvent;
			triggeredEvent="paint";
			EventHandler();
			triggeredEvent=old;
		},
		width:function(){return WW;},
		height:function(){return WH;}
	}
}
function type(t){
	return typeof t;
}
function pcall(){
	var fun=arguments[0]||function(){};
	var obj=arguments[1]||null;
	var arr=arguments[2]||[];
	//print(arguments);
	try{
		return fun.call(obj,arr);
	}catch(e){
		console.log(e);
		return e;
	}
}
function unpack(){

	return arguments;
}
window._G=window;
var vars={
	recall:function(v){
		if(v.substr(1,70)==".folder"){
			var table=[];
			var d=v.substr(0,1);
			var len=vars.recall(d+".flen");
			for(var i=0;i<len;i++){
				table[i]=[];
				for(var j=0;j<3;j++){
					table[i][j]=localStorage.getItem(d+".folder["+i+","+j+"]")
				}
			}
			return table;
		}else if(v.substr(1,70)==".file"){
			var table=[];
			var d=v.substr(0,1);
			var len=vars.recall(d+".filen");
			for(var i=0;i<len;i++){
				table[i]=[];
				for(var j=0;j<4;j++){
					table[i][j]=localStorage.getItem(d+".file["+i+","+j+"]")
				}
			}
			return table;
		}else if(v.substr(v.length-6,6)==".attrs"){
			return localStorage.getItem(v).split(",");
		}
		return localStorage.getItem(v);
	},
	store:function(v,val){
		if(v.substr(1,70)==".folder"){
			var d=v.substr(0,1);
			var len=val.length;
			for(var i=0;i<len;i++){
				for(var j=0;j<3;j++){
					localStorage.setItem(d+".folder["+i+","+j+"]",val[i][j])
				}
			}
			vars.store(d+".flen",val.length);
			return;
		}else if(v.substr(1,70)==".file"){
			var d=v.substr(0,1);
			var len=val.length;
			for(var i=0;i<len;i++){
				for(var j=0;j<4;j++){
					localStorage.setItem(d+".file["+i+","+j+"]",val[i][j])
				}
			}
			vars.store(d+".filen",val.length);
			return;
		}
		return localStorage.setItem(v,val);
	},
	deleteItem:function(v){
		localStorage.removeItem(v);
	}
}
function rnd(m,n){
	return Math.floor(Math.random()*(n-m))+m;
}
var NL="\n",Comma=",",Space=" ",Bar="|";
var loadString=eval;
var table={
	flaten:function(x){
		var t=[];
		for(var i=0;i<x.length;i++)
			if(x[i]!=null)
				t[t.length]=x[i];
		return t;
	}
}
function tostring(o){
	return ""+o;
}
function tonumber(o){
	return Number(o);
}