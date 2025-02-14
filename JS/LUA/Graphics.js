var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
var WW=innerWidth-5,WH=innerHeight-5;
canvas.width=WW;
canvas.height=WH;
var __Win=null;
var __fontSize=10;
function setColor(color){
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
}
function fillRect(x,y,w,h){
    var R=[x,y,w,h]
    if(__Win){
        $Resize(__Win,R);
    }
    ctx.fillRect(R[0],R[1],R[2],R[3]);
}
function drawRect(x,y,w,h){
    var R=[x,y,w,h]
    if(__Win){
        $Resize(__Win,R);
    }
    ctx.strokeRect(R[0],R[1],R[2],R[3]);
}
function drawString(s,x,y){
    var R=[x,y,0,0]
    if(__Win){
        $Resize(__Win,R);
    }
    ctx.fillText(s,x,y);
}
function rgb(r,g,b){
    return "rgb("+r+","+g+","+b+")";
}
function rgba(r,g,b,a){
    return "rgba("+r+","+g+","+b+","+a+")";
}
function fillArc(x,y,w,h,s,e){
    var R=[x,y,w*2,h*2]
    if(__Win){
        $Resize(__Win,R);
    }
    ctx.ellipse(R[0],R[1],R[2],R[3],0,s,e,true);
}
var circle =[];
function fillCircle(x,y,r){
    var R=[x,y,r*2,r*2]
    if(__Win){
        $Resize(__Win,R);
    }
    if(!circle[r]){
        circle[r]=[];
        for(var i =-r;i<r;i++){
            circle[r][i]=[];
            for(var j =-r;j<r;j++){
                if(Math.sqrt(Math.pow(i,2)+Math.pow(j,2))<=r){
                    circle[r][i][j]=true;
                }else{
                    circle[r][i][j]=false;
                }
            }
        }
    }
    for(var i =-r;i<r;i+=3){
        for(var j =-r;j<r;j+=3){
                if(circle[r][i][j]){
                    fillRect(x+i,y+j,3,3);
                }
        }
    }
    //fillRect(x-r,y-r,r*2,r*2);
}
function drawLine(x1,y1,x2,y2){
    fillRect(x1,y1,x2-x1+1,y2-y1+1);
}
function setPen(style,size){

}
function setFont(font,size){
    __fontSize=size;
    ctx.font=""+size+"px "+font;
}
function getStringWidth(s){

}
function getStringHeight(s){

}
var gc={setColorRGB:function(r,g,b){
        if(type(r)=="object"){
            g=r[1];
            b=r[2];
            r=r[0];
        }
        setColor(rgb(r,g,b));
    },
    bg:function(r,g,b){
        gc.setColorRGB(r,g,b);
        gc.fillRect(0,0,WW,WH);
    },
    drawRawImage:function(img,x,y){
        for(var a=0;a<img.length;a++){
            for(var b=0;b<img[0].length;b++){
                gc.setColorRGB(img[a][b][0],img[a][b][1],img[a][b][2]);
                gc.fillRect(x+a,y+b,1,1);
            }
        }
    },
    drawImage:function(img,x,y){
        ctx.drawImage(img,x,y);
    },
    drawIcon:function(img,x,y,small){
        if(small){
            ctx.drawImage(img,x,y,10,10);
        }else{
            ctx.drawImage(img,x,y,32,32);
        }
    },
    loadRawImage:function(f){
        eval(f);
        var x=temp;
        temp=undefined;
        return x;
    },
    loadImage:function(path){
        var img=new Image();
        if(FS.get(path)==false){
            return nil;
        }
        img.src=FS.get(path);
        return img;
    },
    loadImageData:function(data){
        var img=new Image();
        if(!data) return false;
        img.src=data;
        return img;
    },
    bg:function(r,g,b){
        gc.setColorRGB(r,g,b);
        gc.fillRect(0,0,WW,WH);
    },
    fillImage:function(img){
        ctx.drawImage(img,0,0,WW,WH)
    },
    startWindowing:function(w){
        __Win=w;
    },
    endWindowing:function(){
        __Win=null;
    },
    setColor:setColor,
    fillRect:fillRect,
    fillArc:fillArc,
    fillCircle:fillCircle,
    rgb:rgb,
    rgba:rgba,
    drawRect:drawRect,
    drawString:drawString,
    drawLine:drawLine,
    setPen:setPen,
    setFont:setFont,
    getStringWidth:getStringWidth,
    getStringHeight:getStringHeight,
    ver:"1.4.768"
};
XGC=gc;
function $Resize(W,R){
	if(!inRect(R,W)){
		if(R[0]<W.x){
			R[0]=W.x;
		}else{
			R[0]=W.x+W.w;
		}
		if(R[1]<W.y){
			R[1]=W.y;
		}else{
			R[1]=W.y+W.h;
		}
	}
	if(R[0]+R[2]>W.x+W.w){
		R[2]=W.x+W.w-R[0];
	}
	if(R[1]+R[3]>W.y+W.h){
		R[3]=W.y+W.h-R[1];
	}
	return R;
}