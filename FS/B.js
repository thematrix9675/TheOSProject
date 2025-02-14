if(!FS.exists("B:/reset.dll")){
	console.warn("Reset In Progress: Loading B Drivers");
	FS.newFile("B:/reset.dll");
	FS.newFolder("B:/drivers/")
	FS.newFile("B:/drivers/mouse.dvr")
	FS.set("B:/drivers/mouse.dvr",`"use strict"
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
bios.move("Mouse Driver Loaded");
`);
	FS.newFile("B:/drivers/theme.dvr")
	FS.set("B:/drivers/theme.dvr",`
		themeLoader={
			load:function(fn,ver){
				if(!ver) theme={};
				var file=(FS.get(fn)||"").split(NL);
				for(var i=0;i<file.length;i++){
					if(file[i]=="") continue;
					var index=file[i].split("=")[0];
					var color=file[i].split("=")[1].split(",");
					var col=[];
					for(var j=0;j<3;j++){
						col[j]=tonumber(color[j]);
					}
					if(ver){
						ver[index]=col;
					}else{
						theme[index]=col;
					}
				}
			}
		}
		themeLoader.load("B:/theme.thm");
		bios.move("Theme Driver Loaded");`);
	FS.newFile("B:/theme.thm")
	FS.set("B:/theme.thm",`
TaskbarActive=100,255,255
Taskbar=100,100,255

Background=255,255,255

SignInBackground=0,160,180
SignInText=0,0,0

ElementBg=255,255,255
ElementOutline=0,0,0
ElementText=0,0,0
ElementTextSelected=150,150,200

DesktopText=0,0,0
DesktopBg=200,200,255
DesktopTextSelected=150,150,200

WindowTitleBar=200,200,200

MenuBg=200,200,200
MenuText=0,0,0
MenuTextSel=100,100,255

DarkButton=150,150,150
ButtonClose=255,0,0
ButtonMinTrue=255,134,0
ButtonMinFalse=0,255,0

LoadingBg=150,150,150

Topbar=255,255,255
TopbarText=0,0,0`);
	FS.newFile("B:/drivers/table.dvr")
	FS.set("B:/drivers/table.dvr",`
		table.member=function(t,v){
			if(type(t)!="object"){
				return false;
			}
			for(var i in t){
				if(v==t[i]){
					return true;
				}
			}
		}
		table.copy=function(t){
			var t1=[];
			for(var i in t){
				var v=t[i];
				if(type(v)=="object"){
					t1[i]=table.copy(v);
				}else{
					t1[i]=v;
				}
			}
			return t1;
		}
		bios.move("Table Driver Loaded");`)
	FS.newFile("B:/drivers/drag.dvr")
	FS.set("B:/drivers/drag.dvr",`
var __Dragging=false;
registerEventHandler(function(){
	if(triggeredEvent=="mouseMove"){
		if(mouseDown){
			if(!__Dragging){
				if(__Debug) console.log("dragStart")
				triggeredEvent="dragStart";
				EventHandler();
			}
			__Dragging=true;
			if(__Debug) console.log("drag")
			triggeredEvent="drag";
			EventHandler();
		}else{
			if(__Dragging){
				__Dragging=false;
				if(__Debug) console.log("dragEnd")
				triggeredEvent="dragEnd";
				EventHandler();
			}
		}
	}
});
bios.move("Drag Driver Loaded");
	`)
	FS.newFile("B:/drivers/widget.cls")
	FS.set("B:/drivers/widget.cls",`
gc.drawWidget=function(w){
	pcall(w.paint,w);
}
Widget=function(parent,x,y,w,h){
	this.parent=parent;
	this.x=x;
	this.y=y;
	this.w=w;
	this.h=h;
}
Widget.prototype.paint=function(){}
Widget.prototype.timer=function(){}
Widget.prototype.click=function(){}
bios.move("Widget Class Loaded");
	`)
	FS.newFile("B:/drivers/shutdown.dvr")
	FS.set("B:/drivers/shutdown.dvr",`console.log("f")
if(typeof registerShutdownFunction=="undefined"){
	shutdownFunctions=[];
	oldShutdown=shutdown;
	shutdown=function (){
		var sys=system;
		oldShutdown();
		for(var i=0;i<shutdownFunctions.length;i++){
			pcall(shutdownFunctions[i],sys);
		}
		shutdownFunctions=[];
	}
	registerShutdownFunction=function (fn){
		shutdownFunctions[shutdownFunctions.length]=fn;
	}
	bios.move("Alternate Shutdown Driver Loaded");
}
	`)
	FS.newFile("B:/drivers/SystemInfo.dvr")
	FS.set("B:/drivers/SystemInfo.dvr",`
SystemInfo={
	Memory:"16GB",
	MemoryPath:"G:/",
	HardDrive:"1TB",
	WindowsDrivePath:"C:/",
	MacDrivePath:"M:/",
	LinuxDrivePath:"L:/",
	AndroidDrivePath:"A:/",
	RecoveryDrivePath:"R:/",
	FloppyDrivePath:"R:/",
	TrashDrivePath:"T:/",
	BiosMemoryPath:"B:/",
	DosDrivePath:"D:/",
	CDDrive:"RW",
	CDDrivePath:"Z:/",
	FloppyDrive:"RW 5'",
	MountLetter:"E",
	BiosVer:bios.ver,
	CPU:"Cromoxus Core 3G",
	GPU:"Raven TX50",
	Motem:"Peridot XL96",
	Ipv4:"10.0.0.112",
	NetworkProvider:"Selenite",
	NetworkName:"nitenet",
	SPU:"Andrite TI84",
	Bios:"Cromox Bios",
	XGCVersion:gc.version
}
bios.move("System Info Loaded")
	`)
}