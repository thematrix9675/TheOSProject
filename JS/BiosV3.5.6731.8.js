try{
	var __handler=[];
	var triggeredEvent;
	on={};
	var __dblClickDelay=20;
	var mouseTimer=0;
	var system;
	var timediff=0;
	var timerid=0;
	function EventHandler(){
		var args=arguments;
		if(__Debug&&triggeredEvent!="paint"&&triggeredEvent!="timer") console.log(triggeredEvent);
		for(var i=0;i<__handler.length;i++){
			if( __handler[i](triggeredEvent,args)){
				return true;
			}
		}
		if( triggeredEvent=="mouseDown"){
			if(__Debug) console.log(timerid-timediff);
			timediff=timerid;
			if(mouseTimer>0){
				triggeredEvent="dblClick";
				mouseTimer=__dblClickDelay;
				return EventHandler();
			}
			mouseTimer=__dblClickDelay;
			mouse={x:args[0],y:args[1],[0]:args[0],[1]:args[1]}
		} else if(triggeredEvent=="mouseMove"){
			mouse={x:args[0],y:args[1],[0]:args[0],[1]:args[1]}
		} else if(triggeredEvent=="timer"){
			platform.window.invalidate();
			timerid++;
			if(mouseTimer>0){
				mouseTimer=mouseTimer-1;
			}
		}
		if(system){
			if(type(system[triggeredEvent])=="function"){
				pcall(system[triggeredEvent],system,unpack(args));
			}
		} else if(bios){
			if(type(bios[triggeredEvent])=="function"){
				pcall(bios[triggeredEvent],bios,unpack(args));
			}
		}
	}
	function registerEventHandler(f){
		__handler[__handler.length]=f
	}
	function setNewEvent(t){
		on=t||on;
	}
	function setDblClickDelay(i){
		__dblClickDelay=tonumber(i);
	}
	//var _,fail = pcall(loadstring(vars.recall("file.con")));
	var fail=false;
	if(fail){
		error("Cannot Load FileSystem");
	}
	var BiosRom=function(){
		this.os=FS.get("B:/os.sys")||"";
		this.systems=(FS.get("B:/systems.csv")||"").split(",");
		this.state=0;
		this.sel=0;
		this.num=1;
		this.con=[];
		this.maxlines=18;
		for(var i=0;i<this.maxlines;i++){
			this.con[i]="";
		}
		this.msg=[
			" "," "," "," "," ",
			"FileSystem ... Ready",
			"FileSystem Version:8.54 JS Runtime",
			"Display ... Ready",
			"Sound ... "+(typeof Sound!="undefined"?"Ready":"Failed"),
			"Mouse ... Ready",
			"Keyboard ... Ready",
			"PnP ... Ready",
			"Network ... Ready",
			"Loading Drivers ... Ready",
		];
		this.ver="3.5.6731.8";
		this.banner=-20;
	};


	BiosRom.prototype.move=function(e){
		for(var i=0;i<this.maxlines;i++){
			if(this.con[i]==""){
				this.con[i]=e;
				return;
			}
		}
		for(var i=0;i<this.maxlines;i++){
			this.con[i-1]=this.con[i];
		}
		this.con[this.maxlines]=e;
	}
	BiosRom.prototype.paint=function(){
		gc.setColorRGB(0,0,0);
		gc.fillRect(0,0,WW,WH);
		if(this.state==4){
			gc.setColorRGB(255,255,255);
			gc.setFont("sansserif","r",8);
			for(var i=0;i<this.systems.length+1;i++){
				gc.drawString(this.systems[i-1],5,i*10,"top");
			}
			gc.fillRect(0,this.sel*10,WW,10);
			gc.setColorRGB(0,0,0);
			gc.drawString(this.systems[this.sel],5,this.sel*10+10,"top");
		}else if(this.state==5){
			gc.setColorRGB(255,255,255);
			gc.drawString('Press "Y" to reset',10,10);
			gc.drawString('Press "N" to return',10,30);
		}else{
			gc.setColorRGB(255,255,255);
			for(var i=0;i<this.con.length;i++){
				gc.drawString(this.con[i],5,i*10+50,"top")
			}

			for(var i=1;i<20;i++){
				gc.setColorRGB(i*6,0,0);
				gc.drawLine(0,i+10,this.banner-i,i+10);
				gc.drawLine(0,i+35,this.banner-i-25,i+35);
			}
			if(this.state>0){
				gc.setColorRGB(0,0,255);
				gc.drawString("Cromoxus Bios",13,13,"top");
				gc.drawString("v."+this.ver,27,23,"top");
			}
		}
	}
	BiosRom.prototype.escapeKey=function(arr){
		this.state=4;
	}
	BiosRom.prototype.timer=function (){
		var self=this;
		if(this.state==0){
			this.banner+=10;
			if(this.banner>=WW*.75){
				this.state++;
			}
		}else if(this.state==1){
			this.con[this.num]=this.msg[this.num];
			this.num++;
			if(!this.msg[this.num]){
				this.state=2;
				this.num=0;
				this.drivers=FS.getFolderList("B:/drivers/");
			}
		}else if(self.state==2){
			var err=dofile("B:/drivers/"+self.drivers[self.num]);
			if(err){
				this.error("Failed to load driver:   "+self.drivers[self.num])
				return;
			}
			self.num++;
			if(!self.drivers[self.num]){
				self.state=3;
			}
		}else if(self.state==3){
			if(self.os){
				if(self.os==" "){
					self.state=4;
					return;
				}
				system={};
				setNewEvent(system);
				var d=FS.get("B:/OS/"+self.os+".drv");
				var err=dofile(vars.recall(d+".boot"));
				if(err){
					self.state=4;
					system=nil;
					return
				}
				self.state=3;
			}else{
				self.state=4;
			}
		}
	}
	BiosRom.prototype.enterKey=function(){
		if(this.state==4){
			FS.set("B:/os.sys",this.systems[this.sel])
			bios=new BiosRom();
		}
	}
	BiosRom.prototype.arrowKey=function(k){
		var key=k[0][0];
		if(this.state==4){
			if(key=="ArrowUp"&&this.sel!=0){
				this.sel--;
			}else if(key=="ArrowDown"&&this.sel!=(this.systems.length-1)){
				this.sel++;
			}
		}
	}
	BiosRom.prototype.controlKey=function(){
		this.state=5;
	}
	BiosRom.prototype.charIn=function(c){
		if(this.state==5){
			if(c[0][0]=="y"||c[0][0]=="Y"){
				reset();
			}else if(c[0][0]=="n"||c[0][0]=="N"){
				this.state=0;
			}
		}
	}
	BiosRom.prototype.error=function(msg){
		this.move(msg);
		this.state=-1
	}
	function reset(){
		localStorage.clear();
		location.reload();
		console.clear();
	}
	function shutdown(){
		bios=new BiosRom();
		bios.state=4;
		system=nil;
	}
	var bios=new BiosRom();

}catch(e){
	console.log(e);
}