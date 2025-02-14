if(!FS.exists("B:/reset.dll")){
	console.warn("Reset In Progress: Loading D Drive");
	FS.setFileMat("D",[["","","",""]]);
	FS.setFolderMat("D",[["","",""]]);
	vars.store("D.boot","D:/boot.sys");
	FS.newFile("D:/boot.sys")
	FS.set("D:/boot.sys",`dofile("D:/command.com");
		dofile("D:/io.sys");
		dofile("D:/main.sys");
		on.batch=(FS.get("D:/dos/autoexec.bat")||"").split(NL);`);
	FS.newFolder("D:/dos/");
	FS.newFolder("D:/dos/commands/");
	FS.newFile("D:/command.com");
	FS.set("D:/command.com",`
	try{
		var commands=FS.getFolderList("D:/dos/commands/");
		on.commands={};
		on.drives={};
		for(var i=0;i<commands.length;i++){
			dofile("D:/dos/commands/"+commands[i]);
		}
	}catch(e){
		console.log(e);
	}`);
	FS.newFile("D:/io.sys")
	FS.set("D:/io.sys",`
	try{
		on.paint=function(){
			gc.bg(0,0,0);
			for(var i=0;i<this.MAX;i++){
				gc.setColorRGB(this.con[i][2]);
				var c="";
				if(this.con[i][1]!=0){
					c=(this.con[i][3]||this.loc)+">"
				}
				c+=this.con[i][0]
				if(i==on.MAX-1&&this.cursor){
					c+="|";
				}
				gc.setFont("sans-serif",16);
				gc.drawString(c,3,18*i+18);
			}
		}
		on.backspaceKey=function(){
			this.con[on.MAX-1][0]=this.con[on.MAX-1][0].substr(0,this.con[on.MAX-1][0].length-1);
		}
		on.timer=function(){
			if(this.fn&&!this.pause){
				var done=this.fn(this.num);
				this.num++
				if(done){
					this.fn=nil;
					this.num=nil;
				}
			}else if(!(this.pause||this.input)){
				this.time++
				if(this.time==10){
					this.time=0;
					this.cursor=!this.cursor;
				}
				if(this.bat){
					var line=(this.bat[this.line]||"").split(Space);
					line=this.env(line);
					this.line++;
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
						this.com=this.bat[this.line]||"";
						this.eval(line);
					}
				}
			}
		}
		on.charIn=function(c){
			var char=c[0][0];
			if(this.pause){
				this.pause=nil;
			}else{
				this.con[on.MAX-1][0]+=char;
			}
		}
		on.clearKey=function(){
			this.con[on.MAX-1][0]="";
		}
		on.enterKey=function(){
			var text=this.env(this.con[on.MAX-1][0].split(" "));
			var s=FS.getDrive(this.loc).split(":")[0];
			this.com=this.con[on.MAX-1][0];
			if(this.input){
				this.vars[this.input]=this.con[on.MAX-1][0];
				this.input=nil;
				this.con[on.MAX-1][0]=""
			}else if(type(this.commands[text[0]])!="undefined"||this.drives[s]){
				this.com=this.con[on.MAX-1][0];
				this.eval(text);
			}else if(FS.exists(this.loc+text[0]+".bat")&&FS.getExt(this.loc+text[0]+".bat")=="bat"){
				this.bat=(FS.get(this.loc+text[0]+".bat")||"").split(NL);
				this.lines=0;
				this.batchVars(text);
			}else{
				this.move(this.con[on.MAX-1][0],1,this.green,this.loc);
				this.move("Bad file or command name",0,this.red);
			}
		}
	}catch(e){
		console.log(e);
	}`)
	FS.newFile("D:/main.sys");
	FS.set("D:/main.sys",`
	try{
		on.move=function(msg,show,color,loc){
			for(var i=0;i<this.con.length-1;i++){
				this.con[i-1]=this.con[i];
			}
			this.con[on.MAX-2]=[msg,show,color,loc||this.loc];
			this.con[on.MAX-1]=["",1,this.green];
		}
		on.eval=function(com){
			if(!this.bat||this.echo){
				this.move(this.com,1,this.green);
			}
			this.batchVars(com);
			var commands=this.drives[FS.getDrive(this.loc).split(":")[0]]||this.commands;
			if(commands[com[0]]||commands.default){
				var s=(commands[com[0]]||commands.default).call(this,com);
				if(type(s)=="function"){
					this.fn=s;
					this.num=0;
				}
			}else{
				this.move("Bad file or command name",0,this.red);
			}
		}
		on.batchVars=function(com){
			for(var i=0;i<com.length;i++){
				this.vars[tostring(i)]=tostring(com[i]);
			}
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
		on.jump=function(){
			var ifs=this.ifs-1;
			for(var i=this.line;i<this.lines.length;i++){
				if(this.ifs==ifs){
					this.line=i;
					return;
				}else if(this.bat[i].substr(0,2)=="if"){
					this.ifs++;
				}else if(this.bat[i].substr(0,3)=="end"){
					this.ifs--;
				}
			}
			this.bat=nil;
			this.ifs=0;
		}
		on.vars={};
		on.time=0
		on.cursor=true;
		on.ver="6.0.6";
		on.ifs=0;
		on.pause=false;
		on.echo=true;
		on.loc="D:/";
		on.red=[255,0,0];
		on.green=[0,255,0];
		on.blue=[0,0,255];
		on.white=[255,255,255];
		on.MAX=51;
		on.con=[];
		for(var i=0;i<on.MAX;i++){
			on.con[i]=["",0,on.red,""];
		}
		on.con[on.MAX-1]=["",1,on.green];
	}catch(e){
		console.log(e);
	}`);
	FS.newFile("D:/dos/commands/cd.com")
	FS.set("D:/dos/commands/cd.com",`
	on.commands.cd=function(c){
		dir=c[1];
		var dirs=(dir||"").split("/");
		for(var i=0;i<dirs.length;i++){
			var dir=dirs[i];
			if(dir.substring(dir.length-1)==":"){
				this.loc=dir+"/";
			}else{
				var d=FS.getDrive(this.loc);
				d=d.substring(0,d.length-1);
				var f=FS.getFolderMat(d);
				for(var j=0;j<f.length;j++){
					if(f[j][1]==this.loc.split(":")[1]&&f[j][2]==dir){
						this.loc+=dir+"/";
					}
				}
				if(dir==".."){
					this.loc=FS.up(this.loc);
				}
			}
		}
	}`);
	FS.newFile("D:/dos/commands/dir.com");
	FS.set("D:/dos/commands/dir.com",`
on.commands.dir=function(c){
	var f=FS.getFolderList(this.loc,nil,true,true);
	for(var i=0;i<f.length;i++){
		var color=this.green;
		if(f[i].substring(f[i].length-1)=="/"){
			color=this.blue;
			f[i]="DIR "+f[i];
		}else{
			f[i]="       "+f[i];
		}
		this.move(f[i],0,color);
	}
}
	`);
	FS.newFile("D:/dos/commands/pause.com")
	FS.set("D:/dos/commands/pause.com",`
try{
on.commands.pause=function(){
	this.pause=true;
	if(this.com.substring(7)!=""){
		this.con[on.MAX-2][0]=this.com.substring(6);
		this.con[on.MAX-2][1]=0;
		this.con[on.MAX-2][2]=this.white;
	}else{
		this.con[on.MAX-2][0]="Press any key to continue...";
		this.con[on.MAX-2][1]=0;
		this.con[on.MAX-2][2]=this.white;
	}
}
	}catch(e){
		console.log(e);
	}`)
	FS.newFile("D:/dos/commands/cls.com");
	FS.set("D:/dos/commands/cls.com",`
on.commands.cls=function(){
	on.con=[];
	for(var i=0;i<on.MAX;i++){
		on.con[i]=["",0,on.red,""];
	}
	on.con[on.MAX-1]=["",1,on.green];
}`)
	FS.newFile("D:/dos/commands/rd.com")
	FS.set("D:/dos/commands/rd.com",`
on.commands.rd=function(c){
	var dir=c[1];
	var i=0;
	var h=FS.getHash(this.loc+dir+"/");
	var x=FS.getAttrs(this.loc+dir+"/");
	for(var i=0;i<x.length;i++){
		vars.deleteItem(h+"."+x);
	}
	var d=FS.getDrive(this.loc);
	d=d.substr(0,1);
	var f=FS.getFolderMat(d);
	for(var i=0;i<f.length;i++){
		if(f[i][1]==this.loc.split(":")[1]&&f[i][2]==dir){
			f[i]=nil
			f=table.flaten(f);
		}
	}
	FS.setFolderMat(d,f);
	this.move("Deleted: "+dir,0,this.green);
}`)
	FS.newFile("D:/dos/commands/md.com")
	FS.set("D:/dos/commands/md.com",`
on.commands.md=function(c){
	FS.newFolder(this.loc+c[1]+"/");
	this.move("Folder Created: "+c[1],0,this.green);
}`)
	FS.newFile("D:/dos/commands/new.com")
	FS.set("D:/dos/commands/new.com",`
on.commands.new=function(c){
	if(!FS.exists(this.loc+c[1])){
		FS.newFile(this.loc+c[1]);
		this.move("File Created: "+c[1],0,this.green);
	}else{
		this.move("File exists: "+c[1],0,this.red);
	}
}`)
	FS.newFile("D:/dos/commands/copy.com")
	FS.set("D:/dos/commands/copy.com",`
on.commands.copy=function(c){
	FS.copy(this.loc+c[1],c[2]);
	this.move("Copied: "+dir,0,this.green);
}`)
	FS.newFile("D:/dos/commands/move.com")
	FS.set("D:/dos/commands/move.com",`
on.commands.move=function(c){
	FS.move(this.loc+c[1],c[2]);
	this.move("Moved: "+dir,0,this.green);
}`)
	FS.newFile("D:/dos/commands/link.com")
	FS.set("D:/dos/commands/link.com",`
on.commands.link=function(c){
	FS.link(this.loc+c[1],c[2]);
	this.move("Linked: "+dir,0,this.green);
}`)
	FS.newFile("D:/dos/commands/attr.com")
	FS.set("D:/dos/commands/attr.com",`
on.commands.attr=function(c){
	if(!c[2]){
		var x=FS.getAttrs(this.loc+c[1]);
		this.move("Attributes of "+c[1]+":",0,this.green)
		for(var i=0;i<x.length;i++){
			this.move("* "+x[i],0,this.green);
		}
	}else{
		this.move("Attribute value of "+c[1]+"'s "+c[2]+" attribute:",0,this.green)
		this.move(FS.getAttr(this.loc+c[1],c[2]),0,this.green);
	}
}`)
	FS.newFile("D:/dos/commands/echo.com")
	FS.set("D:/dos/commands/echo.com",`
on.commands.echo=function(c){
	if(c[1]=="on"){
		this.echo=true;
	}else if(c[1]=="off"){
		this.echo=false;
	}else{
		this.move(this.com.substring(5),0,this.white);
	}
}`)
	FS.newFile("D:/dos/commands/set.com")
	FS.set("D:/dos/commands/set.com",`
on.commands.set=function(c){
	this.vars[c[1]]=c[2];
	this.move(c[1]+": "+this.vars[c[1]],0,this.green);
}`)
	FS.newFile("D:/dos/commands/add.com")
	FS.set("D:/dos/commands/add.com",`
on.commands.add=function(c){
	if(tonumber(this.vars[c[1]])&&tonumber(c[2])){
		this.vars[c[1]]=tostring(tonumber(this.vars[c[1]])+tonumber(c[2]));
	}else{
		this.vars[c[1]]+=c[2];
	}
	this.move(c[1]+": "+this.vars[c[1]],0,this.green);
}`)
	FS.newFile("D:/dos/commands/print.com")
	FS.set("D:/dos/commands/print.com",`
on.commands.print=function(c){
	this.move(this.com.substring(6),0,this.white)
}`)
	FS.newFile("D:/dos/commands/reset.com")
	FS.set("D:/dos/commands/reset.com",`
on.commands.reset=function(c){
	reset();
}`)
	FS.newFile("D:/dos/commands/shutdown.com")
	FS.set("D:/dos/commands/shutdown.com",`
on.commands.shutdown=function(c){
	shutdown();
}`)
	FS.newFile("D:/dos/commands/mkdir.com")
	FS.set("D:/dos/commands/mkdir.com",`
on.commands.mkdir=function(c){
	FS.newFolder(this.loc+c[1]+"/");
	this.move("Folder Created: "+c[1],0,this.green);
}`)
	FS.newFile("D:/dos/commands/rmdir.com")
	FS.set("D:/dos/commands/rmdir.com",`
on.commands.rmdir=function(c){
	var dir=c[1];
	var i=0;
	var h=FS.getHash(this.loc+dir+"/");
	var x=FS.getAttrs(this.loc+dir+"/");
	for(var i=0;i<x.length;i++){
		vars.deleteItem(h+"."+x);
	}
	var d=FS.getDrive(this.loc);
	d=d.substr(0,1);
	var f=FS.getFolderMat(d);
	for(var i=0;i<f.length;i++){
		if(f[i][1]==this.loc.split(":")[1]&&f[i][2]==dir){
			f[i]=nil
			f=table.flaten(f);
		}
	}
	FS.setFolderMat(d,f);
	this.move("Deleted: "+dir,0,this.green);
}`)
	FS.newFile("D:/dos/commands/del.com")
	FS.set("D:/dos/commands/del.com",`
on.commands.del=function(c){
	FS.deleteFile(this.loc+c[1]);
	this.move("File Deleted: "+c[1],0,this.green);
}`)
	FS.newFile("D:/dos/commands/erase.com")
	FS.set("D:/dos/commands/erase.com",`
on.commands.erase=function(c){
	FS.deleteFile(this.loc+c[1]);
	this.move("File Deleted: "+c[1],0,this.green);
}`)
	FS.newFile("D:/dos/commands/newHash.com")
	FS.set("D:/dos/commands/newHash.com",`
on.commands.newHash=function(c){
	var h=c[1]+rnd(1,999999);
	do{
		if(FS.hash(h)){
			h=c[1]+rnd(1,999999);
		}else{
			break;
		}
	}while(true);
	return h
}`)
	FS.newFile("D:/dos/commands/rnd.com")
	FS.set("D:/dos/commands/rnd.com",`
on.commands.rnd=function(c){
	var h=rnd(tonumber(c[1])||0,tonumber(c[2])||1);
	this.move(""+h,0,this.green);
	return h;
}`)
	FS.newFile("D:/dos/commands/error.com")
	FS.set("D:/dos/commands/error.com",`
on.commands.error=function(c){
	err=new RuntimeError(c[1]);
	throw err;
}`)
	FS.newFile("D:/dos/commands/goto.com")
	FS.set("D:/dos/commands/goto.com",`
on.commands.goto=function(c){
	var lable=":"+c[1];
	if(this.bat){
		for(var i=0;i<this.bat.length;i++){
			if(this.bat[i]==label){
				this.line=i+1;
				return;
			}
		}
	}
}`)
	FS.newFile("D:/dos/commands/end.com")
	FS.set("D:/dos/commands/end.com","on.commands.end=function(c){}")
	FS.newFile("D:/dos/commands/ver.com")
	FS.set("D:/dos/commands/ver.com",`on.commands.ver=function(c){
		this.move("DOS v:"+this.ver,0,this.white);
		this.move("BIOS v:"+bios.ver,0,this.white);
		this.move("FileSystem v:"+FS.ver,0,this.white);
		this.move("XGC v:"+gc.ver,0,this.white);
	}`)
	FS.newFile("D:/dos/commands/memory.dvr")
	FS.set("D:/dos/commands/memory.dvr",`
	_G.memloc=_G;
	on.drives.G={};
	on.drives.G.cd=function(c){
		var dir=c[1];
		if(dir==".."){
			var loc=this.loc.split("/");
			var l="G:/"
			memloc=_G;
			for(var i=1;i<loc.length-2;i++){
				l+=loc[i]+"/";
				memloc=memloc[tonumber(loc[i])||loc[i]]
			}
			this.loc=l
			return;
		}else{
			if(type(memloc[tonumber(dir)||dir])=="object"){
				memloc=memloc[tonumber(dir)||dir];
				this.loc+=dir+"/"
			}else{
				this.move("Not a directory",0,this.red);
			}
		}
	}
	on.drives.G.dir=function(c){
		function d(n){
			var x=0;
			for(i in memloc){
				x++;
				if(x>((n)*this.MAX)&&x<((n+1)*this.MAX)){
					var v=memloc[i];
					if(v==null||v==undefined){
						this.move(tostring(i),0,[100,100,100]);
					}else if(type(v)=="object"){
						this.move(tostring(i),0,this.blue);
					}else if(type(v)=="function"){
						this.move(tostring(i),0,[200,200,255]);
					}else if(type(v)=="string"){
						this.move(tostring(i),0,this.green);
					}else if(type(v)=="number"){
						this.move(tostring(i),0,[0,100,0]);
					}else if(type(v)=="boolean"){
						this.move(tostring(i),0,this.white);
					}else{
						this.move(tostring(i),0,this.red);
					}
				}
			}
			if((n*on.MAX)>=x)return true;
			this.pause=true;
		}

		return d;
	}
	on.drives.G.show=function(c){
		this.move(tostring(memloc[tonumber(c[1])||c[1]]),0,this.green)
	}
	on.drives.G.invoke=function(c){
		var v=c[1];
		var values=[]
		for(var i=2;i<c.length;i+=2){
			if(c[i]=="-v"){
				var p=c[i+1].split("/");
				var m=_G;
				for(var j=1;j<p.length;j++){
					if(m[tonumber(p[i])||p[i]]){
						m=m[tonumber(p[i])||p[i]];
					}
				}
				values[values.length]=m
			}else if(c[i]=="-n"){
				values[values.length]=tonumber(c[i+1]);
			}else if(c[i]=="-s"){
				values[values.length]=tostring(c[i+1]);
			}else if(c[i]=="-b"){
				if(c[i+1]=="true"){
					values[values.length]=true;
				}else if(c[i+1]=="false"){
					values[values.length]=false;
				}
			}else{
				this.move("Unrecognized Flag",0,this.red);
			}
		}
		if(type(memloc[tonumber(v)||v])=="function"){
			try{
				returns=memloc[tonumber(v)||v].call(null,values);
				this.move(returns,0,this.green);
			}catch(e){
				var str=e.stack.split(NL);
				for(var i=0;i<str.length;i++){
					this.move(str[i],0,this.red);
				}
			}
		}
	}
	on.drives.G.del=function(c){
		memloc[tonumber(c[1])||c[1]]=undefined;
		this.move("Deleted",0,this.green);
	}
	on.drives.G.md=function(c){
		memloc[tonumber(c[1])||c[1]]={};
		this.move("Directory Created",0,this.green);
	}
	on.drives.G.root=function(c){
		memloc=_G;
		this.loc="G:/"
	}
	on.drives.G.disk=function(c){
		memloc=_G;
		this.loc=tostring(c[1])+":/";
	}
	on.drives.G.fileLoad=function(c){
		var p=c[1].split("/");
		var m=_G;
		for(var j=1;j<p.length-1;j++){
			if(m[tonumber(p[i])||p[i]]){
				m=m[tonumber(p[i])||p[i]];
			}
		}
		var file=FS.get(c[2]);
		if(file){
			m[tonumber(p[p.length-1])||p[p.length-1]]=file;
		}
	}
	on.drives.G.set=function(c){
		va=c[1];
		flag=c[2];
		val=c[3];
		print(va,flag,val);
		if(flag=="-v"){
			var p=c[i+1].split("/");
			var m=_G;
			for(var j=1;j<p.length;j++){
				if(m[tonumber(p[i])||p[i]]){
					m=m[tonumber(p[i])||p[i]];
				}
			}
			memloc[tonumber(va)||va]=m
		}else if(flag=="-n"){
			memloc[tonumber(va)||va]=tonumber(val);
		}else if(flag=="-s"){
			memloc[tonumber(va)||va]=tostring(val);
		}else if(flag=="-b"){
			if(val=="true"){
				memloc[tonumber(va)||va]=true;
			}else if(val=="false"){
				memloc[tonumber(va)||va]=false;
			}else if(val=="flop"){
				memloc[tonumber(va)||va]=!memloc[tonumber(va)||va];
			}
		}else{
			this.move("Unrecognized Flag",0,this.red);
		}
		this.move("Set to:"+memloc[tonumber(va)||va],0,this.green);
	}
`)
	RegisterOS("D","Dos");
}
