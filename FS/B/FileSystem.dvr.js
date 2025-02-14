var FS={
	getFolderList:function(loc,e,h,fol){
		var d=loc.split(":")[0];
		var p=loc.split(":")[1];
		var f=vars.recall(d+".folder");
		var r=[]
		e=type(e)=="object"&&e||[e];
		if(fol){
			for(var i=0;i<f.length;i++)
				if(f[i][1]==p)
					r[r.length]=f[i][2]+"/"
		}
		var f=vars.recall(d+".file");
		for(var i=0;i<f.length;i++){
			if(f[i][1]==p){
				var z=((vars.recall(f[i][0]+".hidden")=="false"))||h;
				var ext=!e[0],found=false;
				for(var j=0;j<e.length;j++){
					if(f[i][3]==e[j])
						found=true;
				}
				ext=ext||found;
				if(z&&ext){
					r[r.length]=f[i][2];
					if(f[i][3]!=""){
						r[r.length-1]+="."+f[i][3];
					}
				}
			}
		}
		return r;
	},
	splitPath:function(loc){
		var l=loc.split(":");
		var d=l[0],l=l[1];
		var x=l.split("/");
		var p,n,e;
		if(x[x.length-1]==""){
			n=x[x.length-2]
			l=l.substr(0,l.length-1-n.length)
			return [d,l,n,NL];
		}else{
			p="/";
			for(var i=1;i<x.length-1;i++){
				p+=x[i]+"/";
			}
			n=x[x.length-1].split(".")[0];
			e=x[x.length-1].split(".")[1]||"";
			return [d,p,n,e];
		}
		return false;
	},
	getPath:function(loc){
		return FS.splitPath(loc)[1];
	},
	getName:function(loc){
		return FS.splitPath(loc)[2];
	},
	getExt:function(loc){
		return FS.splitPath(loc)[3];
	},
	getHash:function(loc){
		var g=FS.splitPath(loc);
		var d=g[0],p=g[1],n=g[2],e=g[3];
		if (e==NL){
			var f=vars.recall(d+".folder");
			for(var i=0;i<f.length;i++){
				if(p==f[i][1]&&n==f[i][2]){
					return f[i][0]
				}
			}
		}else{
			var f=vars.recall(d+".file");
			for(var i=0;i<f.length;i++){
				if(p==f[i][1]&&n==f[i][2]&&e==f[i][3]){
					return f[i][0]
				}
			}
		}
		return false;
	},
	get:function(loc){
		if(__Debug) console.warn("Fetching:"+loc);
		if(FS.exists(loc)){
			if(!FS.isFolder(loc)){
				var h=FS.getHash(loc);
				return vars.recall(h+".con")
			}
		}
		return false;
	},
	isFolder:function(loc){
		var f=loc.split("/");
		return f[f.length-1]=="";
	},
	isFile:function(loc){
		var f=loc.split("/");
		return f[f.length-1]!="";
	},
	set:function(loc,val){
		if(__Debug) console.warn("Placing:"+loc);
		return vars.store(FS.getHash(loc)+".con",val);
	},
	isDrive:function(loc){
		var f=loc.substr(loc.len-1,1);
		return f==":";
	},
	exists:function(loc){
		return FS.getHash(loc)!=false;
	},
	getDrive:function(loc){
		return loc.split(":")[0]+":";
	},
	getAttr:function(loc,attr){
		return vars.recall(FS.getHash(loc)+"."+attr)||false;
	},
	getLength:function(loc){
		return FS.get(loc).length;
	},
	getFileMat:function(d){
		return vars.recall(d+".file");
	},
	getFolderMat:function(d){
		return vars.recall(d+".folder");
	},
	setFileMat:function(d,v){
		return vars.store(d+".file",v);
	},
	setFolderMat:function(d,v){
		return vars.store(d+".folder",v);
	},
	hash:function(h){
		return vars.recall(h+".con")!=null;
	},
	loadFile:function(loc){
		if(__Debug) console.warn("Running:"+loc);
		try{
			eval(FS.get(loc));
		}catch(E){
			console.warn(E);
			return true;
		}
		return false;
	},
	link:function(loc,locat){
		var h=FS.getHash(loc);
		var g=FS.splitPath(loc);
		var d=g[0],p=g[1],n=g[2],e=g[3];
		var f=FS.getFileMat(d);
		f[f.length]=[h,p,n,e];
		FS.setFileMat(d,f);
	},
	newFile:function(loc){
		var g=FS.splitPath(loc);
		var d=g[0],p=g[1],n=g[2],e=g[3];
		var h="a"+rnd(1,999999);
		do{
			if(FS.hash(h)){
				h="a"+rnd(1,999999);
			}else{
				break;
			}
		}while(true);
		vars.store(h+".con"," ");
		vars.store(h+".name",n);
		vars.store(h+".ext",e);
		vars.store(h+".hidden",false);
		vars.store(h+".rdonly",false);
		vars.store(h+".attrs",["name","hidden","rdonly","attrs","ext"])
		var f=vars.recall(d+".file");
		f[f.length]=[h,p,n,e];
		FS.setFileMat(d,f);
	},
	getDriveAttr:function(d,attr){
		return vars.recall(d+"."+attr);
	},
	isHidden:function(loc){
		return vars.recall(FS.getHash(loc)+".hidden");
	},
	isReadOnly:function(loc){
		return vars.recall(FS.getHash(loc)+".rdonly");
	},
	getAttrs:function(loc){
		return vars.recall(FS.getHash(loc)+".attrs")||["name","hidden","rdonly","attrs","ext"];
	},
	newFolder:function(loc){
		var g=FS.splitPath(loc);
		var d=g[0],p=g[1],n=g[2],e=g[3];
		var h="b"+rnd(1,999999);
		do{
			if(FS.hash(h)){
				h="b"+rnd(1,999999);
			}else{
				break;
			}
		}while(true);
		vars.store(h+".name",n);
		vars.store(h+".hidden",false);
		vars.store(h+".rdonly",false);
		vars.store(h+".attrs",["name","hidden","rdonly","attrs","ext"])
		var f=vars.recall(d+".folder");
		f[f.length]=[h,p,n];
		FS.setFolderMat(d,f);
	},
	setAttr:function(loc,attr,v){
		var h=FS.getHash(loc);
		vars.store(h+"."+attr,v);
		var a=FS.getAttrs(loc);
		var x=true;
		for(var i=0;i<a.length;a++){
			if(a[i]==attr) x=false;
		}
		if(x){
			a[a.length]=attr
			vars.store(h+".attrs",a);
		}
	},
	renameFile:function(loc,name){
		var h=FS.getHash(loc);
		var d=FS.getDrive(loc).substring(0,1);
		var name=name.split(".");
		var n=name[0],e=name[1];
		var f=vars.recall(d+".file");
		var p=FS.splitPath(loc)[1];
		for(var i=0;i<f.length;i++){
			if(f[i][0]==h&&f[i][1]==p){
				f[i][2]=n;
				f[i][3]=e;
			}
		}
		FS.setFileMat(d,f);
		vars.store(h+".name",n);
		vars.store(h+".ext",e||"");
	},
	deleteFile:function(loc){
		var g=FS.splitPath(loc);
		var d=g[0],p=g[1],n=g[2],e=g[3];
		var h=FS.getHash(loc);
		var f=vars.recall(d+".file");
		if(d!="t"){
			FS.move(loc,"T:/");
		}else{
			for(var i=0;i<f.length;i++){
				if(f[i][0]==h){
					f[i]=null;
				}
			}
			f=table.flaten(f);
			FS.setFileMat(d,f);
			var v=FS.getAttrs(loc);
			for(var i=0;i<v.length;i++)
				vars.deleteItem(h+"."+v[i]);
		}
	},
	up:function(loc){
		var x=loc.split("/");
		var f=x[0];
		for(var i=1;i<x.length-2;i++){
			f+="/"+x[i];
		}
		f+="/";
		return f;
	},
	move:function(loc,path){
		var g=FS.splitPath(loc);
		var d=g[0],p=g[1],n=g[2],e=g[3];
		var f=vars.recall(d+".file");
		var x;
		for(var i=0;i<f.length;i++){
			if(f[i][1]==p&&f[i][2]==n&&f[i][3]==e){
				x=f[i]
				f[i]=null;
				f=table.flaten(f);
				break;
			}
		}
		FS.setFileMat(d,f);
		var d=path.split(":")[0]
		var p=path.split(":")[1]
		x[1]=p
		var f=FS.getFileMat(d);
		f[f.length]=x
		FS.setFileMat(d,f);
	},
	copy:function(loc,path){
		var f=FS.get(loc);
		var a=FS.getAttrs(loc);
		var x=loc.split("/");
		x=x[x.length-1];
		path=path+x
		FS.newFile(path);
		FS.set(path,f);
		for(var i=0;i<a.length;i++){
			var x=FS.getAttr(loc,a[i]);
			FS.setAttr(loc,a[i],x)
		}
	},
	getFromHash:function(h){
		return vars.recall(h+".con");
	},
	ver:"8.54 JS Runtime"
}
function dofile(loc){
	return FS.loadFile(loc);
}
function RegisterOS(d,sys){
	var systems=FS.get("B:/systems.csv")+","+sys;
	if(FS.get("B:/systems.csv")==" "){
		systems=sys;
	}
	FS.set("B:/systems.csv",systems)
	FS.newFile("B:/OS/"+sys+".drv")
	FS.set("B:/OS/"+sys+".drv",d);
}
