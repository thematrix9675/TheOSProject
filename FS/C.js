if(!FS.exists("B:/reset.dll")){
	console.warn("Reset In Progress: Loading C Drive");
	FS.setFileMat("C",[["","","",""]]);
	FS.setFolderMat("C",[["","",""]]);
	vars.store("C.boot","C:/Windows/boot/boot.sys");
	FS.newFolder("C:/Windows/");
	FS.newFolder("C:/Windows/System32/")
	FS.newFolder("C:/Windows/System32/events/")
	FS.newFolder("C:/Windows/boot/")
	FS.newFolder("C:/Windows/Drivers/")
	FS.newFolder("C:/Windows/Icons/")
	FS.newFolder("C:/Windows/Users/")
	FS.newFolder("C:/Windows/Users/admin/")
	FS.newFolder("C:/Windows/Users/admin/StartMenu/")
	FS.newFolder("C:/Windows/Users/admin/Desktop/")
	FS.newFile("C:/Windows/Users/admin/StartMenu/password.cmd")
	FS.newFile("C:/Windows/Users/admin/Desktop/password.cmd")
	FS.setAttr("C:/Windows/Users/admin/Desktop/password.cmd","x",5);
	FS.setAttr("C:/Windows/Users/admin/Desktop/password.cmd","y",5);
	FS.setAttr("C:/Windows/Users/admin/Desktop/password.cmd","name","Password");
	FS.setAttr("C:/Windows/Users/admin/Desktop/password.cmd","color","black");

	FS.newFile("C:/Windows/Users/admin/pass.psw")
	FS.newFolder("C:/Windows/Commands/")
	FS.newFolder("C:/Windows/Commands/Config/")
	FS.newFile("C:/Windows/boot/boot.sys");
	FS.set("C:/Windows/boot/boot.sys",`
		dofile("C:/Windows/System32/wiwdrw.dll");	 //done
		dofile("C:/Windows/boot/io.sys");			 //done
		dofile("C:/Windows/System32/img.dll");		 //done
		dofile("C:/Windows/System32/var.dll");		 //done
		dofile("C:/Windows/System32/cmd.dll");		 //done
		dofile("C:/Windows/System32/desktop.dll");	 //done
		dofile("C:/Windows/System32/start.dll");	 //done
		dofile("C:/Windows/System32/menu.dll");		 //done
		dofile("C:/Windows/System32/apps.dll");		 //done
		dofile("C:/Windows/System32/openGroups.dll");//done
		dofile("C:/Windows/System32/utils.dll");	 //done
		dofile("C:/Windows/System32/popup.dll");	 //done
		dofile("C:/Windows/System32/batch.dll");	 //done
	`)
	FS.newFile("C:/Windows/boot/io.sys");
	FS.set("C:/Windows/boot/io.sys",`
	var x=FS.getFolderList("C:/Windows/System32/events/",nil,nil,true);
	for(var i=0;i<x.length;i++){
		dofile("C:/Windows/System32/events/"+x[i])
	}`)
	FS.newFile("C:/Windows/System32/events/paint.io");
	FS.set("C:/Windows/System32/events/paint.io",`console.log("paint")
	on.paint=function(){
		if(this.state==1){
			gc.bg(0,0,0);
			gc.drawImage(this.bell,(WW-1000)/2,(WH-600)/2);
			gc.setColorRGB(0,0,255);
			gc.drawString(this.drivers[this.drivnum]||"",5,WH-7,"bottom")
			gc.drawLine(10,WH-5,10+(this.drivnum/this.drivers.length)*300,WH-5)

		}else if(this.state==2||this.state==3){
			gc.fillImage(this.loading);
			gc.setColorRGB(0,255,255);
			var s="";
			if(this.state==2){
				s="Config.sys("+this.num+"/"+(this.config.length-1)+")";
			}else{
				s="Autoexec.bat("+this.num+"/"+(this.autoexec.length-1)+")";
			}
			gc.setFont("sans-serif",25);
			gc.drawString(s,100,WH,"bottom");
		}else if(this.state==4){
			gc.setFont("sans-serif",10);
			gc.bg(theme.SignInBackground);
			gc.setColorRGB(theme.ElementBg);
			gc.fillRect((WW-150)/2,70,150,15);
			gc.fillRect((WW-150)/2,90,150,15);
			gc.setColorRGB(theme.ElementOutline);
			gc.drawRect((WW-150)/2,70,150,15);
			gc.drawRect((WW-150)/2,90,150,15);
			gc.drawRect((WW-156)/2,67+(this.sel*20),156,21)
			gc.setColorRGB(theme.SignInText)
			gc.drawString("Sign-In",WW/2-20,50,"middle");
			gc.drawString("Username:",(WW-270)/2,80)
			gc.drawString("Password:",(WW-270)/2,100)
			gc.drawString(this.username,(WW-150)/2+3,80)
			gc.drawString(this.protect(this.password),(WW-150)/2+3,100)
			if(this.err){
				gc.setColorRGB(255,0,0);
				gc.drawString(this.err,0,WH-10)
			}
		}else if(this.state==5){
			gc.bg(theme.DesktopBg);
			if(this.bg) gc.drawImage(this.bg,0,0);
			if(this.sel){
				gc.fillRect(this.desktop[this.sel].x,this.desktop[this.sel].y,36,46);
			}
			for(var i=0;i<this.desktop.length;i++){
				gc.drawIcon(this.desktop[i].icon,tonumber(this.desktop[i].x),tonumber(this.desktop[i].y));
				gc.setColor(this.desktop[i].color);
				gc.drawString(this.desktop[i].name,tonumber(this.desktop[i].x),tonumber(this.desktop[i].y)+46);
			}
			for(var i=0;i<this.w.length;i++){
				this.drawWindow(this.w[i]);
			}
			if(this.activeWindow()){
				this.drawWindow(this.activeWindow());
			}
			gc.setColorRGB(theme.Taskbar);
			gc.fillRect(0,WH-15,WW,15);
			gc.setColorRGB(theme.ElementOutline);
			gc.drawRect(0,WH-15,30,15)
			gc.setColorRGB(theme.ElementText);
			gc.drawString("start",3,WH-2)
			if(this.activeWindow()){
				var x=this.openGroups.groupNumber(this.activeWindow().appname);
				gc.setColorRGB(theme.TaskbarActive);
				gc.fillRect(x*15+30,WH-15,15,15);
			}
			for(var i=0;i<this.openGroups.length;i++){
				gc.drawIcon(this.openGroups[i].icon,i*15+30,WH-13,true)
			}
			var time="";
			var date=new Date();
			time=date.getHours()+":"+date.getMinutes();
			gc.setColorRGB(theme.ElementOutline)
			gc.drawRect(WW-30,WH-15,30,15)
			gc.setColorRGB(theme.ElementText);
			gc.drawString(time,WW-30,WH-2)
			this.menu&&this.menu.paint();
			this.tooptip&&this.tooltip.paint();
		}
	}`);
	FS.newFile("C:/Windows/System32/events/timer.io")
	FS.set("C:/Windows/System32/events/timer.io",`
on.timer=function(){
	if(this.state==1){
		if(this.drivers[this.drivnum]){
			dofile("C:/Windows/Drivers/"+this.drivers[this.drivnum])
			this.drivnum++;
		}else{
			this.state=2;
			this.drivers=null;
			this.drivnum=null;
			this.num=0;
		}
	}else if(this.state==2){
		(this.num==0)&&this.findConfig("[Windows]");
		if(this.config[this.num]){
			this.runConfig();
			this.num++
		}else{
			this.state=3;
			this.num=0;
		}
	}else if(this.state==3){
		if(this.autoexec[this.num]){
			this.runAutoexec();
		}else{
			this.state++;
		}
	}else if(this.state==5){
		this.tooltip&&this.tooltip.timer();
		var w=this.activeWindow();
		w&&pcall(w.timer,w);
		for(var i=0;i<this.__tick.length;i++){
			pcall(this.__tick,this);
		}
	}
}
	`)
	FS.newFile("C:/Windows/System32/var.dll")
	FS.set("C:/Windows/System32/var.dll",`
		on.drivers=FS.getFolderList("C:/Windows/Drivers/");
		on.drivnum=0;
		on.config=FS.get("C:/Windows/Config.sys").split(NL);
		on.autoexec=FS.get("C:/Windows/Autoexec.bat").split(NL);
		on.users=FS.get("C:/Windows/System32/Users.csv").split(Comma);
		on.desktop=[];
		on.w=[false];
		on.w.activeWindow=false;
		on.openGroups=[];
		on.vars={};
		on.ifs=0;
		on.filesApp="C:/Windows/SysWOWx64/explorer.exe";
		on.apps={};
		on.__tick=[];
		on.state=1;
		on.sel=0;
		on.num=0;
		on.username=""
		on.password=""
	`)
	FS.newFile("C:/Windows/Config.sys");
	FS.set("C:/Windows/Config.sys",`
[Windows]
ControlPanel DateTime
ControlPanel Theme
ControlPanel Background
ControlPanel Display
ControlPanel Keyboard
ControlPanel Mouse
ControlPanel DeviceManager
ControlPanel NetworkManager
ControlPanel Font
ControlPanel Scripting
ControlPanel Shortcuts
ControlPanel DriveManager
ControlPanel SystemInfo
ControlPanel User
ControlPanel Sound
ControlPanel Environment
ControlPanel InstallRemove
ControlPanel FileFilters
ControlPanel Drivers
	`);
	FS.newFile("C:/Windows/Autoexec.bat");

	FS.newFile("C:/Windows/System32/Users.csv");
	FS.set("C:/Windows/System32/Users.csv",'admin');
	FS.newFile("C:/Windows/System32/img.dll");
	FS.set("C:/Windows/System32/img.dll",`
		on.bell=gc.loadImage("C:/Windows/System32/BELL.png");
		on.loading=gc.loadImage("C:/Windows/System32/Loading.png");
		var icons=FS.getFolderList("C:/Windows/Icons/",null,true);
		on.icons=[];
		for(var i=0;i<icons.length;i++){
			on.icons[icons[i].split(".")[0]]=XGC.loadImage("C:/Windows/Icons/"+icons[i]);
		}
	`);
	FS.newFile("C:/Windows/System32/wiwdrw.dll");
	FS.set("C:/Windows/System32/wiwdrw.dll",`console.log("windrw")
on.drawWindow=function(w){
	if(w&&!w.__min){
		if(w.topy){
			gc.setColorRGB(theme.WindowTitleBar);
			gc.fillRect(w.x,w.topy,w.w,15)
			gc.setColorRGB(theme.ElementOutline);
			gc.drawRect(w.x,w.topy,w.w,w.h+15)
			gc.drawRect(w.x,w.topy,w.w,15)
			gc.drawRect(w.x+w.w-30,w.topy,15,15)
			if(mouseOver(w.x+w.w-15,w.topy,15,15)){
				gc.setColor("red")
				gc.fillRect(w.x+w.w-15,w.topy,15,15)
			}
			if(mouseOver(w.x+w.w-30,w.topy,15,15)){
				gc.setColor("#00ad7e")
				gc.fillRect(w.x+w.w-30,w.topy,15,15)
			}
			gc.setColorRGB(theme.ElementText);
			gc.drawString(w.name,w.x+18,w.topy+12)
			gc.drawString("_",w.x+w.w-28,w.topy+10)
			gc.drawString("X",w.x+w.w-13,w.topy+10)
			gc.drawIcon(w.icon,w.x+2,w.topy+2,true)
		}
		gc.startWindowing(w)
		gc.bg(theme.Background)
		pcall(w.paint,w)
		gc.endWindowing()
	}
}
	`);
	FS.newFile("C:/Windows/System32/cmd.dll")
	FS.set("C:/Windows/System32/cmd.dll",`
var con=FS.getFolderList("C:/Windows/Commands/Config/");
on.configCom={};
for(var i=0;i<con.length;i++){
	dofile("C:/Windows/Commands/Config/"+con[i]);
}
var com=FS.getFolderList("C:/Windows/Commands/");
on.commands={};
for(var i=0;i<com.length;i++){
	dofile("C:/Windows/Commands/"+com[i]);
}
	`);
	FS.newFile("C:/Windows/System32/desktop.dll")
	FS.set("C:/Windows/System32/desktop.dll",`
on.desktop.newMenu=function(i){
	var menu=new system.newMenu([
		["Copy",function(self){
			self=self[0];
			system.clipboard=[self.location,"copy"];
			system.menu=nil;
		}],
		["Cut",function(self){
			self=self[0];
			system.clipboard=[self.location,"cut"];
			system.menu=nil;
		}],
		["Rename",function(self){
			self=self[0];
			system.Prompt("Rename","Rename:",function(s){
				s=s[0];
				if(s!=nil){
					FS.renameFile(self.location,s);
				}
				system.desktop.loadDesktop(system,system.user);
			})
			system.menu=nil;
		}],
		["Properties",function(self){
			self=self[0];
			system.Properties(self.location);
			system.menu=nil;
		}],
		["Move",function(self){
			self=self[0];
			system.Prompt("Move","Move:'x,y'",function(s){
				s=s[0];
				if(s!=nil){
					var x=s.split(",")[0];
					var y=s.split(",")[1];
					x=tonumber(x);
					y=tonumber(y);
					if(x&&y){
						FS.setAttr(self.location,"x",x)
						FS.setAttr(self.location,"y",y)
					}
				}
				system.desktop.loadDesktop(system,system.user);
			});
			system.menu=nil;
		}]
	],mouse[0],mouse[1]);
	menu.location=system.desktop[i].location;
	menu.sel=1;
	return menu;
}
on.desktop.loadDesktop=function(self,user){
	var desktop=FS.getFolderList("C:/Windows/Users/"+user+"/Desktop/");
	loc="C:/Windows/Users/"+user+"/Desktop/";
	for(var i=0;i<desktop.length;i++){
		self.desktop[i]={
			x:FS.getAttr(loc+desktop[i],"x"),
			y:FS.getAttr(loc+desktop[i],"y"),
			icon:XGC.loadImageData(FS.getAttr(loc+desktop[i],"icon"))||self.icons[FS.getExt(loc+desktop[i])]||self.icons.file,
			name:desktop[i],
			color:FS.getAttr(loc+desktop[i],"color")||theme.ElementText,
			location:loc+desktop[i]
		}
	}
}
on.desktop.mouseDown=function(){
	for(var i=0;i<system.desktop.length;i++){
		if(mouseOver(system.desktop[i].x,system.desktop[i].y,36,46)){
			system.sel=i;
			return;
		}
	}
	system.sel=false;
}
	`)
	FS.newFile("C:/Windows/System32/batch.dll");
	FS.set("C:/Windows/System32/batch.dll",`
on.findConfig=function(t){
	for(var i=0;i<this.config.length;i++){
		if(this.config[i]==t){
			this.num=i+1;
			return
		}
	}
	this.state++;
}
on.runConfig=function(){
	var config=this.config[this.num].split(" ");

	if(this.configCom[config[0]]){
		pcall(this.configCom[config[0]],this,config)
	}
}
on.runAutoexec=function(){
	var line=(this.autoexec[this.num]||"").split(" ");
	line=this.env(line);
	this.num++
	if(line[0]=="if "){
		this.ifs++;
		if(line[2]=="exists"){
			if(!FS.exists(this.loc+line[1])) this.jump();
		}else if(line[2]=="!="){
			if(line[1]==line[3]) this.jump();
		}else if(line[2]=="=="){
			if(line[1]!=line[3]) this.jump();
		}
		if(this.line>=this.lines.length){
			this.bat=nil;
			this.line=nil;
		}
	}else{
		if(this.commands[line[0]]){
			pcall(this.commands[line[0]],this,line);
		}
	}
}
on.eval=function(line){
	for(var i=0;i<line.length;i++){
		if(line[i].subsrting(0,1)){
			if(this.vars[line[i].sub(1)]){
				line[i]=this.vars[line[i].sub(1)];
			}
		}
	}
	return line;
}
		on.jump=function(){
			var ifs=this.ifs-1;
			for(var i=this.num;i<this.autoexec.length;i++){
				if(this.ifs==ifs){
					this.num=i;
					return;
				}else if(this.autoexec[i].substr(0,2)=="if"){
					this.ifs++;
				}else if(this.autoexec[i].substr(0,3)=="end"){
					this.ifs--;
				}
			}
			this.autoexec=nil;
			this.ifs=0;
		}
		on.env=function(com){
			for(var i=0;i<com.length;i++){
				var c=com[i];
				if(c.substr(0,1)=="%"){
					this.vars.rnd=tostring(rnd(1,999999));
					var vars=c.substring(1);
					com[i]=this.vars[vars];
				}
			}
			return com;
		}
	`)
	FS.newFile("C:/Windows/System32/start.dll")
	FS.set("C:/Windows/System32/start.dll",`console.log("start")
on.newStartMenu=function(){
	this.menu=new this.newMenu([
		["Programs",function(self){
			self=self[0];
			var prgm=FS.getFolderList(system.userpath+"StartMenu/")
			var lables=[];
			for(var i=0;i<prgm.length;i++){
				var path=system.userpath+"StartMenu/"+prgm[i];
				lables[i]=[prgm[i].split(".")[0],function(self){
					system.openFile(path)
					system.menu=nil;
				}]
			}
			self.submenu=new system.newMenu(lables,self.x+self.w,self.y);
		}],
		["settings",function(self){
			system.launch("C:/Windows/SysWOWx64/settings.exe")
			system.menu=nil;
		}],
		["Sign-Out",function(self){
			for(var i=0;i<system.desktop.length;i++){
				system.desktop[i]=nil;
			}
			system.user=nil;
			system.menu=nil;
			system.userPath=nil;
			system.state=4;
			system.username="";
			system.password="";
		}],
		["Power",function(){shutdown()}]
	],0,WH-55);
}
	`)
	FS.newFile("C:/Windows/System32/menu.dll");
	FS.set("C:/Windows/System32/menu.dll",`console.log("menu");
on.newMenu=function(lables,x,y){
	this.lables=lables||[];
	this.x=x||mouse[0];
	this.y=y||mouse[1];
	this.h=this.lables.length*10;
	this.w=100;
	this.sel=1;
}
on.newMenu.prototype.paint=function(){
	gc.setColorRGB(theme.MenuBg);
	gc.fillRect(this.x,this.y,this.w,this.h);
	for(var i=0;i<this.lables.length;i++){
		gc.setColorRGB(theme.MenuText)
		gc.drawString(this.lables[i][0],this.x+3,this.y+i*10+10);
	}
	if(this.submenu){
		this.submenu.paint();
	}
}
on.newMenu.prototype.mouseDown=function(){
	if(this.submenu){
		this.submenu.mouseDown()
	}else{
		for(var i=0;i<this.lables.length;i++){
			if(mouseOver(this.x,this.y+i*10,this.w,10)){
				return pcall(this.lables[i][1],null,[this,i]);
			}
		}
		system.menu=nil;
	}
}
on.newMenu.prototype.escapeKey=function(){
	if(this.submenu){
		if(this.submenu.submenu){
			this.submenu.escapeKey();
		}else{
			this.submenu=nil;
		}
	}
}
	`);
	FS.newFile("C:/Windows/System32/utils.dll");
	FS.set("C:/Windows/System32/utils.dll",`
on.protect=function(pw){
	if(type(pw)=="string"){
		if(pw.length==0){
			return pw;
		}else{
			var len=pw.length;
			pw=""
			for(var i=0;i<len;i++){
				pw+="*";
			}
		}
	}
	return pw;
}
on.setOpenWith=function(ext,file){
	var set=false;
	for(var i=0;i<this.openWith.length;i++){
		if(this.openWith[i][0]==ext){
			this.openWith[i][1]=file;
			set=true;
		}
	}
	if(!set){
		this.openWith[this.openWith.length]=[ext,file]
	}
	var s=this.openWith[0][0]+","+this.openWith[0][1];
	for(var i=1;i<this.openWith.length;i++){
		s=s+";"+this.openWith[i][0]+","+this.openWith[i][1]
	}
	FS.set("C:/Windows/System32/open.csv",s)
}
on.newWindow=function(app,loc,args){
	var w=new app();
	this.w[this.w.length]=w;
	w.location=loc;
	w.win=this.w.length-1
	w.appname=app.appname;
	pcall(w.init,w,args);
	this.activeWindow(this.w.length-1);
}
	`);
	FS.newFile("C:/Windows/System32/events/charIn.io");
	FS.set("C:/Windows/System32/events/charIn.io",`
on.charIn=function(c){
	var c=c[0][0];
	if(this.state==4){
		if(this.sel==0){
			this.username+=c;
		}else{
			this.password+=c;
		}
	}else if(this.state==5){
		if(this.menu){
			pcall(this.menu.charIn,this.menu,c)
		}else if(this.activeWindow()){
			pcall(this.activeWindow().charIn,this.activeWindow(),c);
		}
	}
}
	`);
	FS.newFile("C:/Windows/System32/events/enterKey.io");
	FS.set("C:/Windows/System32/events/enterKey.io",`
on.enterKey=function(){
	if(this.state==4){
		var username=this.username;
		if(username==""){
			this.err="Please enter your username";
		}else{
			if(table.member(this.users,username)){
				var password=FS.get("C:/Windows/Users/"+username+"/pass.psw")
				if(password==this.password||username=="admin"){
					this.desktop.loadDesktop(this,username);
					this.userpath="C:/Windows/Users/"+username+"/";
					this.user=username;
					this.bg=XGC.loadImage(this.userpath+"bg.img");
					this.state=5;
					this.sel=0;
				}else{
					this.err="Incorrect usrename or password";
				}
			}else{
				this.err="Incorrect usrename or password";
			}
		}
	}else if(this.state==5){
		if(this.menu){
			pcall(this.menu.enterKey,this.menu)
		}else if(this.activeWindow()){
			pcall(this.activeWindow().enterKey,this.activeWindow());
		}
	}
}
`)
FS.newFile("C:/Windows/System32/events/backspaceKey.io")
FS.set("C:/Windows/System32/events/backspaceKey.io",`
on.backspaceKey=function(){
	if(this.state==4){
		if(this.sel==0){
			this.username=this.username.substr(0,this.username.length-1);
		}else{
			this.password=this.password.substr(0,this.password.length-1);
		}
	}else if(this.state==5){
		if(this.activeWindow()){
			pcall(this.activeWindow().backspaceKey,this.activeWindow());
		}
	}
}
`)
FS.newFile("C:/Windows/System32/events/escapeKey.io")
FS.set("C:/Windows/System32/events/escapeKey.io",`
on.escapeKey=function(){
	if(this.state==5){
		if(this.menu){
			this.menu=nil
		}else if(this.activeWindow()){
			pcall(this.activeWindow().escapeKey,this.activeWindow());
		}
	}
}
`)
FS.newFile("C:/Windows/System32/events/tabKey.io");
FS.set("C:/Windows/System32/events/tabKey.io",`
on.tabKey=function(){
	if(this.state==4){
		this.sel=(this.sel==0)&&1||0;
	}else if(this.state==5){
		if(this.activeWindow()){
			pcall(this.activeWindow().tabKey,this.activeWindow());
		}
	}
}
`);
FS.newFile("C:/Windows/System32/events/arrowKey.io")
FS.set("C:/Windows/System32/events/arrowKey.io",`
on.arrowKey=function(d){
	d=d[0][0];
	if(this.state==5){
		if(this.activeWindow()){
			pcall(this.activeWindow().arrowKey,this.activeWindow(),d);
		}
	}
}
`)
FS.newFile("C:/Windows/System32/events/mouseDown.io");
FS.set("C:/Windows/System32/events/mouseDown.io",`console.log("f")
on.mouseDown=function(){
	if(this.state==4){
		if(mouseOver((WW-150)/2,70,150,15)){
			this.sel=0;
		}else if(mouseOver((WW-150)/2,90,150,15)){
			this.sel=1;
		}
	}else if(this.state==5){
		if(this.menu){
			return this.menu.mouseDown();
		}else if(mouseOver(1,WH-15,30,15)){
			this.newStartMenu()
			return;
		}else if(mouseOver(30,WH-15,WW-30,15)){
			for(var i=0;i<(WW-30)/15;i++){
				if(this.openGroups[i]){
					if(mouseOver(i*15+30,WH-15,15,15)){
						this.menu=this.openGroups.menu(i);
					}
				}
			}
		}else{
			if(this.activeWindow()){
				var i=this.activeWindow();
				var w=i;
				if(mouseOver(w.x+w.w-30,w.topy,15,15)){
					w.__min=true;
					return;
				}else if(mouseOver(w.x+w.w-15,w.topy,15,15)){
					return this.close(w.win);
				}
				if(i&&mouseOver(i.x,i.topy,i.w,i.h+15)){
					pcall(i.mouseDown,i);
					return;
				}
			}
			for(var i=this.w.length-1;i>0;i--){
				var w=this.w[i];
				if(mouseOver(w.x+w.w-30,w.topy,15,15)){
					w.__min=true;
					return;
				}else if(mouseOver(w.x+w.w-15,w.topy,15,15)){
					return this.close(w);
				}else{
					return this.activeWindow(i);
				}
			}
			this.desktop.mouseDown();
		}
	}
}
`);
FS.newFile("C:/Windows/System32/events/dblClick.io");
FS.set("C:/Windows/System32/events/dblClick.io",`
on.dblClick=function(){
	var i=this.activeWindow();
	if(i){
		if(mouseOver(i.x,i.topy,i.w,i.h+15)){
			pcall(i.dblClick,i);
		}
	}else{
		for(var i=0;i<this.desktop.length;i++){
			if(mouseOver(this.desktop[i].x,this.desktop[i].y,36,46)){
				this.openFile(this.desktop[i].location);
			}
		}
	}
}
`);
FS.newFile("C:/Windows/System32/events/drag.io");
FS.set("C:/Windows/System32/events/drag.io",`console.log("DRAG")
on.drag=function(){
	var i=this.activeWindow();
	if(this.dragWin!=undefined){
		this.dragWin.x=mouse[0]-i.w/2
		this.dragWin.topy=mouse[1]-15/2
		this.dragWin.y=this.dragWin.topy+15
	}
	if(this.dragDesk!=undefined){
		this.desktop[this.dragDesk].x=mouse[0]-16;
		this.desktop[this.dragDesk].y=mouse[1]-21;
		return;
	}
}
`)
FS.newFile("C:/Windows/System32/events/dragEnd.io");
FS.set("C:/Windows/System32/events/dragEnd.io",`console.log("DRAG")
on.dragEnd=function(){
	this.dragWin=undefined;
	if(this.dragDesk!=undefined){
		FS.setAttr(this.desktop[this.dragDesk].location,"x",this.desktop[this.dragDesk].x)
		FS.setAttr(this.desktop[this.dragDesk].location,"y",this.desktop[this.dragDesk].y)
		this.desktop.loadDesktop(this,this.user);
	}
	this.dragDesk=undefined;
}
`)
FS.newFile("C:/Windows/System32/events/dragStart.io");
FS.set("C:/Windows/System32/events/dragStart.io",`console.log("DRAG")
on.dragStart=function(){
	var i=this.activeWindow();
	if(i){
		if(mouseOver(i.x,i.topy,i.w,15)){
			this.dragWin=i;
			return;
		}
	}
	for(var i=0;i<this.desktop.length;i++){
		if(mouseOver(this.desktop[i].x,this.desktop[i].y,36,46)){
			this.dragDesk=i;
			return;
		}
	}
}
`)

FS.newFile("C:/Windows/System32/events/returnKey.io");
FS.set("C:/Windows/System32/events/returnKey.io",`
on.returnKey=function(){
	if(this.state==5){
		for(var i=0;i<this.desktop.length;i++){
			if(mouseOver(this.desktop[i].x,this.desktop[i].y,36,46)){
				this.menu=this.desktop.newMenu(i);
			}
		}
		if(this.activeWindow()){
			pcall(this.activeWindow().returnKey,this.activeWindow());
		}
	}
}
`);
FS.newFile("C:/Windows/System32/openGroups.dll");
FS.set("C:/Windows/System32/openGroups.dll",`
on.openGroups.open=function(app,location){
	system.icons[location]=XGC.loadImageData(FS.getAttr(location,"icon"))||system.icons[FS.getExt(location)]||system.icons.file
	var open=false;
	if(system.openGroups.groupNumber(app)){
		return;
	}
	system.openGroups[system.openGroups.length]={name:app,icon:system.icons[location]}
}
on.openGroups.groupNumber=function(name){
	for(var i=0;i<system.openGroups.length;i++){
		if(name==system.openGroups[i].name){
			return i;
		}
	}
	return false;
}
on.openGroups.close=function(name){
	for(var i=0;i<system.w.length;i++){
		if(system.w[i]&&system.w[i].appname==name){
			return;
		}
	}
	var i=system.openGroups.groupNumber(name);
	system.openGroups[i]=nil;
	var open=system.openGroups.open;
	var close=system.openGroups.close;
	var menu=system.openGroups.menu;
	var grpnum=system.openGroups.groupNumber
	system.openGroups=table.flaten(system.openGroups);
	system.openGroups.open=open;
	system.openGroups.close=close;
	system.openGroups.menu=menu;
	system.openGroups.groupNumber=grpnum;
}
on.openGroups.menu=function(num){
	var s=[];
	function x(arg){
		var menu=arg[0];
		var i=arg[1];
		menu.submenu=new system.newMenu([
			["close",function(sub){
				system.close(menu.lables[i].w)
				system.menu=nil;
			}],
			["Show",function(sub){
				system.w[menu.lables[i].w].__min=false;
				system.menu=nil;
			}]
		],menu.x+menu.w,WH-15-(menu.lables.length*10))
	}
	var name=system.openGroups[num].name;
	for(var i=0;i<system.w.length;i++){
		if(system.w[i]&&system.w[i].appname==name){
			s[s.length]=[system.w[i].name||system.w[i].appname,x]
			s[s.length-1].w=i;
		}
	}
	if(s.length==0){
		return system.openGroups.close(system.openGroups[num].name);
	}
	return new system.newMenu(s,num*15+15,WH-15-s.length*10)
}
`);
FS.newFile("C:/Windows/System32/popup.dll");
FS.set("C:/Windows/System32/popup.dll",`
on.Properties=function(a,b,c){
	this.launch("C:/Windows/SysWOWx64/properties.exe",a,b,c);
}
on.Prompt=function(a,b,c){
	this.launch("C:/Windows/SysWOWx64/prompt.exe",a,b,c);
}
on.SaveDontCancel=function(a,b,c){
	this.launch("C:/Windows/SysWOWx64/saveDontCancel.exe",a,b,c);
}
on.Dialog=function(a,b,c){
	this.launch("C:/Windows/SysWOWx64/dialog.exe",a,b,c);
}
on.Confirm=function(a,b,c){
	this.launch("C:/Windows/SysWOWx64/confirm.exe",a,b,c);
}

`);
FS.newFile("C:/Windows/Systwm/32/open.csv")
FS.newFile("C:/Windows/System32/apps.dll");
FS.set("C:/Windows/System32/apps.dll",`
on.openWith=FS.get("C:/Windows/Systwm/32/open.csv").split(";");
for(var i=0;i<on.openWith.length;i++){
	on.openWith[i]=on.openWith[i].split(",");
}
on.openFile=function(loc){
	var e=FS.getExt(loc);
	if(e=="exe"){
		this.launch(loc);
	}else if(e=="lua"||e=="asm"){
		dofile(loc);
	}else{
		for(var i=0;i<this.openWith.length;i++){
			if(this.openWith[i][0]==e){
				return this.launch(this.openWith[i][1],loc);
			}
		}
		this.launch("C:/Windows/SysWOWx64/chose.exe",loc);
	}
}
on.launch=function(loc){
	var appname=FS.getAttr(loc,"appname");
	this.openGroups.open(appname,loc);
	if(!this.apps[appname]){
		this.apps[appname]=function(){
			//;pcall(this.prototype.init,this,arguments);
		};
		this.apps[appname].location=loc;
		this.apps[appname].appname=appname
		setNewEvent(this.apps[appname].prototype);
		dofile(loc);
	}
	this.newWindow(this.apps[appname],loc,arguments)
}
on.activeWindow=function(i){
	if(i){
		this.w.activeWindow=i;
	}else{
		return this.w[this.w.activeWindow]
	}
}
on.close=function(i){
	var appname=this.w[i]&&this.w[i].appname
	if(this.w[i]&&this.w[i].save){
		this.SaveDontCancel(function(file,filter){
			this.launch(this.filesApp,[file,i],filter,function(file,args){
				FS.set(file,args[0]);
				this.w[args[0]]=false;
			},"saveAs")
		},function(w){
			this.w[w.win]=false;
		},this.w[i])
	}else{
		this.w[i]=false;
	}
	this.openGroups.close(appname);
	this.w.activeWindow=false;
}
`);
	FS.newFile("C:/Windows/SysWOWx64/chose.exe");
	FS.setAttr("C:/Windows/SysWOWx64/chose.exe","appname","chooser.exe")
	FS.set("C:/Windows/SysWOWx64/chose.exe",`
	`);
	FS.newFile("C:/Windows/SysWOWx64/properties.exe");
	FS.setAttr("C:/Windows/SysWOWx64/properties.exe","appname","properties.exe")
	FS.set("C:/Windows/SysWOWx64/properties.exe",`
on.init=function(arg){
	this.name="";
	this.icon=system.icons.exe;
	this.paint=function(){
		var x=this.x,y=this.y;
	}
	this.x=100;
	this.y=100;
	this.w=300;
	this.h=100;
	this.topy=85;
}
	`);
	FS.newFile("C:/Windows/SysWOWx64/prompt.exe");
	FS.setAttr("C:/Windows/SysWOWx64/prompt.exe","appname","prompt.exe")
	FS.set("C:/Windows/SysWOWx64/prompt.exe",`
on.init=function(arg){
	var title=arg[1]
	var text=arg[2]
	var fun=arg[3]
	this.name=tostring(title||"prompt");
	this.icon=system.icons.exe;
	this.text=type(text)=="string"&&text||"Enter a value"
	this.returns="";
	this.paint=function(){
		var x=this.x,y=this.y;
		gc.setColorRGB(theme.ElementBg);
		gc.fillRect(x+5,y+15,90,15)
		gc.setColorRGB(theme.ElementOutline)
		gc.drawRect(x+5,y+15,90,15)
		gc.setColorRGB(theme.ElementText);
		gc.setFont("sana-serif",10)
		gc.drawString(this.text,x,y+10)
		gc.drawString(this.returns,x+5,y+25)
	}
	this.enterKey=function(){
		pcall(fun,null,[this.returns])
		system.close(this.win);
	}
	this.charIn=function(c){
		this.returns+=c;
	}
	this.backspaceKey=function(){
		this.returns=this.returns.substr(0,this.returns.length-1);
	}
	this.x=rnd(1,WW-100);
	this.y=rnd(16,WH-40);
	this.w=100;
	this.h=40;
	this.topy=this.y-15;
}
	`);

	FS.newFile("C:/Windows/SysWOWx64/saveDontCancel.exe");
	FS.setAttr("C:/Windows/SysWOWx64/saveDontCancel.exe","appname","saveDontCancel.exe")
	FS.set("C:/Windows/SysWOWx64/saveDontCancel.exe",`

	`);
	FS.newFile("C:/Windows/SysWOWx64/dialog.exe");
	FS.setAttr("C:/Windows/SysWOWx64/dialog.exe","appname","dialog.exe")
	FS.set("C:/Windows/SysWOWx64/dialog.exe",`

	`);
	FS.newFile("C:/Windows/SysWOWx64/confirm.exe");
	FS.setAttr("C:/Windows/SysWOWx64/confirm.exe","appname","confirm.exe")
	FS.set("C:/Windows/SysWOWx64/confirm.exe",`

	`);

	RegisterOS("C","Windows");
}