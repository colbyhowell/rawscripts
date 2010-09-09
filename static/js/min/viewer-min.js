var OSName="Unknown OS";if(navigator.appVersion.indexOf("Win")!=-1){OSName="Windows"}if(navigator.appVersion.indexOf("Mac")!=-1){OSName="MacOS"}if(navigator.appVersion.indexOf("X11")!=-1){OSName="UNIX"}if(navigator.appVersion.indexOf("Linux")!=-1){OSName="Linux"}if($.browser.webkit){var browser="webkit"}if($.browser.mozilla){var browser="mozilla"}if($.browser.opera){var browser="opera"}var ud=0;var viewNotes=true;var timer;var typeToScript=true;var pasting=false;var undoQue=[];var redoQue=[];var pageBreaks=[];var mouseX=0;var mouseY=0;var shiftDown=false;var mouseDownBool=false;var scrollBarBool=false;var commandDownBool=false;var characters=[];var scenes=[];var canvas;var ctx;var linesNLB=[];var vOffset=0;var pos={col:0,row:0};var anch={col:0,row:0};var background="#fff";var font="10pt Courier";var fontWidth=8;var foreground="#000";var lineheight=13;var milli=0;var formatMenu=false;var resource_id="random123456789";var WrapVariableArray=[[62,111-10,0,1,2],[62,111-10,0,0,2],[40,271-10,0,1,1],[36,191-10,0,0,2],[30,231-10,0,0,1],[61,601-10,1,1,2]];var editorWidth=850;var headerHeight=65;var lines=[];notes=[];$(document).ready(function(){document.getElementById("canvas").height=$("#container").height()-60;document.getElementById("canvas").width=$("#container").width()-320;editorWidth=$("#container").width()-323;document.getElementById("sidebar").style.height=($("#container").height()-65)+"px";$("#container").mousewheel(function(a,b){if(a.target.id=="canvas"){a.preventDefault();scroll(-b*25)}});$("#recipient").keyup(function(a){if(a.which==188){tokenize("recipient")}});$("#recipient").keydown(function(a){if(a.which==13){a.preventDefault()}});$("#subject").keydown(function(a){if(a.which==13){a.preventDefault()}});$(".menuItem").click(function(){openMenu(this.id)});$(".menuItem").mouseover(function(){topMenuOver(this.id)});$(".menuItem").mouseout(function(){topMenuOut(this.id)});setup()});$(window).resize(function(){document.getElementById("canvas").height=$("#container").height()-60;document.getElementById("canvas").width=$("#container").width()-320;editorWidth=$("#container").width()-323;document.getElementById("sidebar").style.height=($("#container").height()-65)+"px";paint(false,false,false,false)});$("*").keydown(function(a){var b=new Date();milli=b.getMilliseconds();if(a.which==38){upArrow()}else{if(a.which==40){downArrow()}else{if(a.which==39){rightArrow()}else{if(a.which==37){leftArrow()}else{if(a.which==16){shiftDown=true}else{if((OSName=="MacOS"&&(a.which==91||a.which==93)&&browser=="webkit")||(OSName=="MacOS"&&a.which==224&&browser=="mozilla")||(OSName=="MacOS"&&a.which==17&&browser=="opera")||(OSName!="MacOS"&&a.which==17)){commandDownBool=true}}}}}}if((ud<0||ud>document.getElementById("canvas").height-80)&&typeToScript&&a.which!=13&&a.which!=46&&a.which!=8){scroll(ud-400)}if(typeToScript){if(anch.row==pos.row&&pos.col==anch.col){document.getElementById("ccp").value=""}document.getElementById("ccp").focus();document.getElementById("ccp").select()}});$("*").keyup(function(a){if(a.which==16){shiftDown=false}if(typeToScript){document.getElementById("ccp").focus();document.getElementById("ccp").select()}});$("*").mousedown(function(a){if(typeToScript){mouseDown(a);document.getElementById("ccp").focus();document.getElementById("ccp").select()}});$("*").mouseup(function(a){if(typeToScript){mouseUp(a);document.getElementById("ccp").focus();document.getElementById("ccp").select()}});$("*").mousemove(function(a){mouseMove(a)});function selection(){if(pos.row>anch.row){var d={row:anch.row,col:anch.col};var a={row:pos.row,col:pos.col}}else{if(pos.row==anch.row&&pos.col>anch.col){var d={row:anch.row,col:anch.col};var a={row:pos.row,col:pos.col}}else{var d={row:pos.row,col:pos.col};var a={row:anch.row,col:anch.col}}}if(d.row==a.row){var b=lines[d.row][0].slice(d.col,a.col)}else{arr=[];arr.push([lines[d.row][0].slice(d.col),lines[d.row][1]]);d.row=d.row*1+1;while(d.row<a.row){arr.push([lines[d.row][0],lines[d.row][1]]);d.row+=1}arr.push([lines[a.row][0].slice(0,a.col),lines[a.row][1]]);var b=JSON.stringify(arr)}var e=document.getElementById("ccp");e.value=b;e.focus();e.select()}function setup(){resource_id=window.location.href.split("=")[1];$.post("/scriptcontent",{resource_id:resource_id},function(e){if(e=="not found"){lines=[["Sorry, the script wasn't found.",1]];paint(false,false,true,false);return}var f=JSON.parse(e);var g=f[0];document.getElementById("title").innerHTML=g;var a=f[1];for(var d=0;d<a.length;d++){lines.push([a[d][0],a[d][1]])}if(lines.length==2){pos.row=1;anch.row=1;pos.col=lines[1][0].length;anch.col=pos.col}for(d in f[3]){notes.push(f[3][d])}var c=document.getElementById("canvas");var b=c.getContext("2d");tabs(0);sceneIndex();noteIndex();document.getElementById("ccp").focus();document.getElementById("ccp").select();paint(false,false,true,false);setInterval("paint(false,false, false,false)",40)})}function tabs(a){var b=["sceneTab","noteTab"];for(i in b){var d=document.getElementById(b[i]);if(i==a){d.style.backgroundColor="#3F5EA6";d.style.color="white";document.getElementById(b[i].replace("Tab","s")).style.display="block"}else{d.style.backgroundColor="#6C8CD5";d.style.color="black";document.getElementById(b[i].replace("Tab","s")).style.display="none"}}}function mouseUp(c){mouseDownBool=false;scrollBarBool=false;var b=document.getElementById("canvas").width;var a=document.getElementById("canvas").height;if(c.clientY-headerHeight>a-39&&c.clientY-headerHeight<a&&c.clientX>editorWidth-22&&c.clientX<editorWidth-2){if(c.clientY-headerHeight>a-20){scroll(30)}else{scroll(-30)}}}function mouseDown(k){var b=false;var m=document.getElementsByTagName("div");for(var g=0;g<m.length;g++){if(m[g].className=="topMenu"&&m[g].style.display=="block"){b=true;var n=m[g]}}if(b){var d=k.target;while(d.nodeName!="DIV"){d=d.parentNode}id=d.id;var j=id.slice(0,-1);if(j=="format"){changeFormat(id.slice(-1))}if(id=="save"){save(0)}else{if(id=="new"){newScriptPrompt()}else{if(id=="open"){openPrompt()}else{if(id=="rename"){renamePrompt()}else{if(id=="exportas"){exportPrompt()}else{if(id=="duplicate"){duplicate()}else{if(id=="close"){closeScript()}else{if(id=="undo"){undo()}else{if(id=="redo"){redo()}else{if(id=="cut"){var q=setTimeout("cut()",50)}else{if(id=="copy"){copy()}else{if(id=="paste"){pasting=true;var q=setTimeout("paste()",50)}else{if(id=="insertNote"){viewNotes=true;newThread()}else{if(id=="editTitlePage"){window.open("/titlepage?resource_id="+resource_id)}else{if(id=="revision"){window.open("/revisionhistory?resource_id="+resource_id)}else{if(id=="notes"){viewNotes=(viewNotes?false:true)}else{if(id=="email"){emailPrompt()}}}}}}}}}}}}}}}}}n.style.display="none"}else{if(document.getElementById("suggestBox")!=null){if(k.target.className=="suggestItem"){lines[pos.row][0]=k.target.value;pos.col=anch.col=lines[pos.row][0].length}document.getElementById("suggestBox").parentNode.removeChild(document.getElementById("suggestBox"))}else{var p=document.getElementById("canvas").height;var h=(pageBreaks.length+1)*72*lineheight;var o=((p)/h)*(p-39);if(o<20){o=20}if(o>=p-39){o=p-39}var l=(vOffset/(h-p))*(p-39-o)+headerHeight;if(k.clientX>headerHeight&&k.clientX<editorWidth-100&&k.clientY-headerHeight>40){mouseDownBool=true;mousePosition(k,"anch")}else{if(k.clientX<editorWidth&&k.clientX>editorWidth-20&&k.clientY>l&&k.clientY<l+o){scrollBarBool=true}}}}}function mousePosition(k,o){var m=new Date();milli=m.getMilliseconds();var h=0;var q=0;var b=k.clientY+vOffset;var n=15*lineheight+3;var p=0;for(i in lines){p=n;if(pageBreaks.length!=0&&pageBreaks[h]!=undefined&&pageBreaks[h][0]==i){if(pageBreaks[h][2]==0){n=72*lineheight*(h+1)+10*lineheight+headerHeight+3;h++}else{n=72*lineheight*(h+1)+10*lineheight+headerHeight+3;n+=(linesNLB[i].length-pageBreaks[h][2])*lineheight;if(lines[i][1]==3){n+=lineheight}n-=(lineheight*linesNLB[i].length);h++}}n+=(lineheight*linesNLB[i].length);if(n>b){if(pageBreaks.length!=0&&pageBreaks[h-1]!=undefined&&pageBreaks[h-1][0]==i&&pageBreaks[h-1][2]!=0){if((b-p)/lineheight<pageBreaks[h-1][2]){var c=Math.round((b-p)/lineheight+0.5)}else{if(b<72*lineheight*(h)+10*lineheight+headerHeight){var c=pageBreaks[h-1][2]}else{var c=Math.round((lineheight*linesNLB[i].length-n+b)/lineheight+0.5)}}}else{var c=Math.round((lineheight*linesNLB[i].length-n+b)/lineheight+0.5)}var g=0;var f=0;while(g+1<c){f+=linesNLB[i][g]+1;g++}var a;if(lines[i][1]!=5){a=Math.round((k.clientX-Math.round((editorWidth-fontWidth*87-24)/2)-WrapVariableArray[lines[i][1]][1])/fontWidth)}else{a=Math.round((k.clientX-Math.round((editorWidth-fontWidth*87-24)/2)-WrapVariableArray[lines[i][1]][1]+(lines[i][0].length*fontWidth))/fontWidth)}if(a<0){a=0}if(a>linesNLB[i][g]){a=linesNLB[i][g]}f+=a;if(f<0){f=0}if(f>lines[i][0].length){f=lines[i][0].length}if(o=="anch"){pos.row=anch.row=i*1;pos.col=anch.col=f*1}else{pos.row=i;pos.col=f}a=n=f=h=q=b=p=c=m=null;return}}}function mouseMove(a){if(scrollBarBool){scrollBarDrag(a)}mouseX=a.clientX;mouseY=a.clientY;if(mouseDownBool){mousePosition(a,"pos")}}function scrollBarDrag(d){var c=mouseY-d.clientY;var a=document.getElementById("canvas").height-50;var b=(pageBreaks.length+1)*72*lineheight;vOffset-=b/a*c;if(vOffset<0){vOffset=0}var b=(pageBreaks.length+1)*72*lineheight-document.getElementById("canvas").height+20;if(vOffset>b){vOffset=b+20}}function scroll(a){vOffset+=a;if(vOffset<0){vOffset=0}var b=(pageBreaks.length+1)*72*lineheight-document.getElementById("canvas").height+20;if(vOffset>b){vOffset=b+20}}function jumpTo(a){if(a!=""){var g=parseInt(a.replace("row",""));pos.row=g;anch.row=pos.row;pos.col=lines[pos.row][0].length;anch.col=pos.col}else{var g=pos.row}var c=0;for(var b=0;b<g;b++){for(var d=0;d<pageBreaks.length;d++){if(pageBreaks[d][0]==b){c+=lineheight*(72-pageBreaks[d][1])}}c+=(linesNLB[b].length*lineheight)}vOffset=c;var f=(pageBreaks.length+1)*72*lineheight-document.getElementById("canvas").height;if(vOffset>f){vOffset=f}}function upArrow(){if(typeToScript&&document.getElementById("suggestBox")==null){if(pos.row==0&&pos.col==0){return}var g=lines[pos.row][1];if(g==0){var f=WrapVariableArray[0]}else{if(g==1){var f=WrapVariableArray[1]}else{if(g==2){var f=WrapVariableArray[2]}else{if(g==3){var f=WrapVariableArray[3]}else{if(g==4){var f=WrapVariableArray[4]}else{if(g==5){var f=WrapVariableArray[5]}}}}}}if(lines[pos.row][0].length>f[0]){var h=lines[pos.row][0].split(" ");var a=0;var b=[];while(a<h.length){if(h.slice(a).join().length<=f[0]){b.push(h.slice(a).join().length);a=h.length}else{var j=0;while(h.slice(a,a+j).join().length<f[0]){j++}b.push(h.slice(a,a+j-1).join().length);a+=j-1}}j=0;var e=b[0];while(e<pos.col){j++;e+=b[j]+1}if(pos.row==0&&j==0){pos.col=anch.col=0;return}if(j==0){var c=lines[pos.row-1][1];if(c==0){var d=WrapVariableArray[0]}else{if(c==1){var d=WrapVariableArray[1]}else{if(c==2){var d=WrapVariableArray[2]}else{if(c==3){var d=WrapVariableArray[3]}else{if(c==4){var d=WrapVariableArray[4]}else{if(c==5){var d=WrapVariableArray[5]}}}}}}if(lines[pos.row-1][0].length<d[0]){pos.row--;if(pos.col>lines[pos.row][0].length){pos.col=lines[pos.row][0].length}}else{var h=lines[pos.row-1][0].split(" ");var a=0;var b=[];while(a<h.length){if(h.slice(a).join().length<=f[0]){b.push(h.slice(a).join().length);a=h.length}else{var j=0;while(h.slice(a,a+j).join().length<f[0]){j++}b.push(h.slice(a,a+j-1).join().length);a+=j-1}}pos.row--;pos.col+=lines[pos.row][0].length-b[b.length-1];if(pos.col>lines[pos.row][0].length){pos.col=lines[pos.row][0].length}}}else{pos.col-=b[j-1]+1;if(pos.col>(e-b[j]-1)){pos.col=e-b[j]-1}}}else{if(pos.row==0){pos.col=0}else{var c=lines[pos.row-1][1];if(c==0){var d=WrapVariableArray[0]}else{if(c==1){var d=WrapVariableArray[1]}else{if(c==2){var d=WrapVariableArray[2]}else{if(c==3){var d=WrapVariableArray[3]}else{if(c==4){var d=WrapVariableArray[4]}else{if(c==5){var d=WrapVariableArray[5]}}}}}}if(lines[pos.row-1][0].length<d[0]){pos.row--;if(pos.col>lines[pos.row][0].length){pos.col=lines[pos.row][0].length}}else{var h=lines[pos.row-1][0].split(" ");var a=0;var b=[];while(a<h.length){if(h.slice(a).join().length<=f[0]){b.push(h.slice(a).join().length);a=h.length}else{var j=0;while(h.slice(a,a+j).join().length<f[0]){j++}b.push(h.slice(a,a+j-1).join().length);a+=j-1}}pos.row--;pos.col+=lines[pos.row][0].length-b[b.length-1];if(pos.col>lines[pos.row][0].length){pos.col=lines[pos.row][0].length}}}}if(!shiftDown){anch.col=pos.col;anch.row=pos.row}if(ud<0){paint(false,false,false,false)}}}function downArrow(){if(typeToScript&&document.getElementById("suggestBox")==null){if(pos.row==lines.length-1&&pos.col==lines[pos.row][0].length){return}var d=lines[pos.row][1];if(d==0){var c=WrapVariableArray[0]}else{if(d==1){var c=WrapVariableArray[1]}else{if(d==2){var c=WrapVariableArray[2]}else{if(d==3){var c=WrapVariableArray[3]}else{if(d==4){var c=WrapVariableArray[4]}else{if(d==5){var c=WrapVariableArray[5]}}}}}}if(lines[pos.row][0].length>c[0]){var b=lines[pos.row][0].split(" ");var f=0;var g=[];while(f<b.length){if(b.slice(f).join().length<=c[0]){g.push(b.slice(f).join().length);f=b.length}else{var a=0;while(b.slice(f,f+a).join().length<c[0]){a++}g.push(b.slice(f,f+a-1).join().length);f+=a-1}}a=0;var h=g[0];while(h<pos.col){a++;h+=g[a]+1}if(a+1==g.length){for(var e=0;e<g.length-1;e++){pos.col-=g[e]}pos.col--;pos.row++;if(pos.row>lines.length-1){pos.row--;pos.col=lines[pos.row][0].length}if(pos.col>lines[pos.row][0].length){pos.col=lines[pos.row][0].length}}else{pos.col+=g[a]+1;if(pos.col>(h+g[a+1]+1)){pos.col=h+g[a+1]+1}}}else{if(pos.row==lines.length-1){pos.col=lines[pos.row][0].length}else{pos.row++;if(pos.row>lines.length-1){pos.row=lines.length-1}if(pos.col>lines[pos.row][0].length){pos.col=lines[pos.row][0].length}}}if(!shiftDown){anch.col=pos.col;anch.row=pos.row}if(ud>document.getElementById("canvas").height-50){paint(false,false,false,false)}}}function leftArrow(){if(typeToScript){var b=false;if(pos.row==0&&pos.col==0){return}if(pos.col==0){pos.row--;pos.col=lines[pos.row][0].length;var b=true}else{pos.col=pos.col-1}if(!shiftDown){anch.col=pos.col;anch.row=pos.row}var a=document.getElementById("suggestBox");if(b&&a!=null){a.parentNode.removeChild(a)}}}function rightArrow(){if(typeToScript){var b=false;if(pos.col==lines[pos.row][0].length&&pos.row==lines.length-1){return}if(pos.col==lines[pos.row][0].length){pos.row++;pos.col=0;b=true}else{pos.col=pos.col+1}if(!shiftDown){anch.col=pos.col;anch.row=pos.row}var a=document.getElementById("suggestBox");if(b&&a!=null){a.parentNode.removeChild(a)}}}function pagination(){pageBreaks=[];i=0;var b=0;while(i<lines.length){lineCount=b;while(lineCount+linesNLB[i].length<56){lineCount+=linesNLB[i].length;i++;if(i==lines.length){return}}var a=0;b=0;if(lines[i][1]==3&&lineCount<54&&lineCount+linesNLB[i].length>57){a=55-lineCount;b=1-a;lineCount=56}else{if(lines[i][1]==3&&lineCount<54&&linesNLB[i].length>4){a=linesNLB[i].length-3;b=1-a;lineCount=55}else{if(lines[i][1]==1&&lineCount<55&&lineCount+linesNLB[i].length>57){a=55-lineCount;b=1-a;lineCount=56}else{if(lines[i][1]==1&&lineCount<55&&linesNLB[i].length>4){a=linesNLB[i].length-3;b=1-a;lineCount=55}else{while(lines[i-1][1]==0||lines[i-1][1]==2||lines[i-1][1]==4){i--;lineCount-=linesNLB[i].length}}}}}pageBreaks.push([i,lineCount,a])}}function sceneIndex(){$(".sceneItem").unbind();scenes=[];var a=0;for(var b=0;b<lines.length;b++){if(lines[b][1]==0){a++;var e="";if(b!=lines.length-1){e=lines[b+1][0];if((lines[b+1][1]==2||lines[b+1][1]==5)&&b!=lines.length-2){e+=" "+lines[b+2][0]}}scenes.push([String(a)+") "+lines[b][0].toUpperCase(),b,e]);e=null}}var f=document.getElementById("sceneBox").childNodes;for(var b=0;b<f.length;b++){if(f[b]!=undefined){f[b].parentNode.removeChild(f[b])}b--}for(var b=0;b<scenes.length;b++){var d=document.getElementById("sceneBox").appendChild(document.createElement("p"));d.appendChild(document.createTextNode(scenes[b][0]));d.className="sceneItem";d.id="row"+scenes[b][1];d.title=scenes[b][2];d=null}f=b=a=null;$(".sceneItem").click(function(){$(this).css("background-color","#999ccc");jumpTo(this.id)});$(".sceneItem").mouseover(function(){$(this).css("background-color","#ccccff")});$(".sceneItem").mouseout(function(){$(this).css("background-color","white")})}function sortNotes(d,c){if(d[0]<c[0]){return -1}if(d[0]>c[0]){return 1}if(d[1]<c[1]){return -1}if(d[1]>c[1]){return 1}return 0}function noteIndex(){notes.sort(sortNotes);var g=document.getElementById("noteBox");g.innerHTML="";for(x in notes){var d=g.appendChild(document.createElement("div"));d.className="thread";for(y in notes[x][2]){var f=d.appendChild(document.createElement("div"));var e=f.appendChild(document.createElement("div"));e.innerHTML=notes[x][2][y][0];var b=f.appendChild(document.createElement("div"));b.appendChild(document.createTextNode(notes[x][2][y][1].split("@")[0]));b.align="right";b.className="msgInfo";f.className="msg";f.id=notes[x][3]+"msg"}var a=d.appendChild(document.createElement("div"));a.className="respond";a.appendChild(document.createTextNode("Respond"));a.id=notes[x][3]}typeToScript=true;$(".respond").click(function(){newMessage(this.id)});$(".msg").click(function(){for(i in notes){if(String(notes[i][3])==String(this.id.replace("msg",""))){pos.row=anch.row=notes[i][0];pos.col=anch.col=notes[i][1]}}paint(false,false,false,false);if(ud>document.getElementById("canvas").height){scroll(ud-document.getElementById("canvas").height+200)}if(ud<0){scroll(ud-200)}})}function newThread(){tabs(1);viewNotes=true;document.getElementById("notesViewHide").innerHTML="✓";paint(false,false,false,false);noteIndex();typeToScript=false;var h=document.getElementById("noteBox");var d=h.appendChild(document.createElement("div"));d.className="thread";id=Math.round(Math.random()*1000000000);var e=true;while(e==true){e=false;for(b in notes){if(String(notes[b][3])==String(id)){id=Math.round(Math.random()*1000000000);e=true}}}var g=d.appendChild(document.createElement("div"));g.className="respondControls";var b=g.appendChild(document.createElement("div"));b.contentEditable=true;b.id="nmi";var f=g.appendChild(document.createElement("input"));f.type="button";f.value="Save";f.id="noteSave";var a=g.appendChild(document.createElement("input"));a.type="button";a.value="Cancel";a.id="noteCancel";$("#noteSave").click(function(){submitNewThread(id)});$("#noteCancel").click(function(){noteIndex()});b.focus()}function submitNewThread(b){var e=document.getElementById("nmi").innerHTML;var c=document.getElementById("user_email").innerHTML;var g=new Date();if(e!=""){var a=[pos.row,pos.col,[[e,c,g]],b];notes.push(a);var f=[pos.row,pos.col,e,b];$.post("/notesnewthread",{resource_id:resource_id,row:pos.row,col:pos.col,content:e,thread_id:b,fromPage:"viewer"},function(h){if(h!="sent"){alert("Sorry, there was a problem sending that message. Please try again later.")}})}noteIndex()}function newMessage(b){noteIndex();typeToScript=false;var g=document.getElementById(b);var f=g.parentNode.insertBefore(document.createElement("div"),g);f.className="respondControls";var d=f.appendChild(document.createElement("div"));d.contentEditable=true;d.id="nmi";var e=f.appendChild(document.createElement("input"));e.type="button";e.value="Save";e.id="noteSave";var a=f.appendChild(document.createElement("input"));a.type="button";a.value="Cancel";a.id="noteCancel";g.parentNode.removeChild(g);$("#noteSave").click(function(){submitMessage(b)});$("#noteCancel").click(function(){noteIndex()});d.focus()}function submitMessage(b){for(x in notes){if(notes[x][3]==b){var g=x}}var f=new Date();var e=document.getElementById("nmi").innerHTML;var c=document.getElementById("user_email").innerHTML;if(e!=""){var a=[e,c,f];notes[g][2].push(a);$.post("/notessubmitmessage",{resource_id:resource_id,content:e,thread_id:b,fromPage:"viewer"},function(h){if(h!="sent"){alert("Sorry, there was a problem sending that message. Please try again later.")}})}noteIndex()}function openMenu(a){document.getElementById(a).style.backgroundColor="#6484df";document.getElementById(a).style.color="white";document.getElementById(a+"Menu").style.display="block";var d=document.getElementsByTagName("td");for(var b=0;b<d.length;b++){if(d[b].className=="formatTD"){if(d[b].id=="check"+lines[pos.row][1]){d[b].innerHTML="";d[b].appendChild(document.createTextNode("✓"))}else{d[b].innerHTML=""}}}}function topMenuOver(a){var b=false;var e=document.getElementsByTagName("div");for(var d=0;d<e.length;d++){if(e[d].className=="menuItem"){e[d].style.backgroundColor="#A2BAE9";e[d].style.color="black"}if(e[d].className=="topMenu"){if(e[d].style.display=="block"){e[d].style.display="none";b=true}}}if(b){document.getElementById(a+"Menu").style.display="block"}document.getElementById(a).style.backgroundColor="#6484df";document.getElementById(a).style.color="white";var e=document.getElementsByTagName("td");for(var d=0;d<e.length;d++){if(e[d].className=="formatTD"){if(e[d].id=="check"+lines[pos.row][1]){e[d].innerHTML="";e[d].appendChild(document.createTextNode("✓"))}else{e[d].innerHTML=""}}}}function topMenuOut(a){if(document.getElementById(a+"Menu").style.display=="none"){document.getElementById(a).style.backgroundColor="#A2BAE9";document.getElementById(a).style.color="black"}}function openPrompt(){window.open("/scriptlist")}function closeScript(){var a=JSON.stringify(lines);$.post("/save",{data:a,resource_id:resource_id},function(b){self.close()})}function newScriptPrompt(){typeToScript=false;document.getElementById("newscriptpopup").style.visibility="visible"}function hideNewScriptPrompt(){typeToScript=true;document.getElementById("newScript").value="";document.getElementById("newscriptpopup").style.visibility="hidden";document.getElementById("createScriptButton").disabled=false;document.getElementById("createScriptButton").value="Create";document.getElementById("createScriptIcon").style.visibility="hidden"}function createScript(){var a=document.getElementById("newScript").value;if(a!=""){document.getElementById("createScriptButton").disabled=true;document.getElementById("createScriptButton").value="Creating Script...";document.getElementById("createScriptIcon").style.visibility="visible";$.post("/newscript",{filename:a,fromPage:"viewer"},function(b){window.open("editor?resource_id="+b);hideNewScriptPrompt()})}}function exportPrompt(){if(document.getElementById("saveButton").value=="Save"){save(0)}typeToScript=false;document.getElementById("exportpopup").style.visibility="visible"}function hideExportPrompt(){typeToScript=true;document.getElementById("exportpopup").style.visibility="hidden"}function exportScripts(){var e=window.location.href;var g=e.split("=")[1];if(g=="demo"){nope();return}else{var j;var h="&title_page="+document.getElementById("et").selectedIndex;var f=document.getElementsByTagName("input");for(var k=0;k<f.length;k++){if(f[k].checked==true){if(f[k].className=="exportList"){j=f[k].name;e="/export?resource_id="+g+"&export_format="+j+"&fromPage=editor"+h;window.open(e)}}}}}function scrollArrows(b){var a=document.getElementById("canvas").height;b.fillStyle="#333";b.fillRect(editorWidth-21,a-39,21,20);b.fillStyle="#ddd";b.fillRect(editorWidth-19,a-37,16,16);b.beginPath();b.moveTo(editorWidth-16,a-24);b.lineTo(editorWidth-10.5,a-35);b.lineTo(editorWidth-5,a-24);b.closePath();b.fillStyle="#333";b.fill();b.fillStyle="#333";b.fillRect(editorWidth-21,a-19,20,20);b.fillStyle="#ddd";b.fillRect(editorWidth-19,a-18,16,16);b.beginPath();b.moveTo(editorWidth-16,a-15);b.lineTo(editorWidth-10.5,a-4);b.lineTo(editorWidth-5,a-15);b.closePath();b.fillStyle="#333";b.fill();a=null}function scrollBar(j,f){var a=j.createLinearGradient(editorWidth-15,0,editorWidth,0);a.addColorStop(0,"#5587c4");a.addColorStop(0.8,"#95a7d4");j.strokeStyle="#333";j.fillStyle=a;var h=document.getElementById("canvas").height;var b=(pageBreaks.length+1)*72*lineheight+40;var g=((h)/b)*(h-39);if(g<20){g=20}if(g>=h-39){g=h-39}var d=(vOffset/(b-h))*(h-39-g);j.fillRect(editorWidth-18.5,d+8,16,g-17);j.strokeRect(editorWidth-18.5,d+8,16,g-17);j.beginPath();j.arc(editorWidth-10.5,d+9,8,0,Math.PI,true);j.fill();j.stroke();j.beginPath();j.arc(editorWidth-10.5,d+g-11,8,0,Math.PI,false);j.fill();j.stroke();var c=d;while(c<d+g){var e=j.createRadialGradient(editorWidth,c+10,4,editorWidth+200,c,10);e.addColorStop(0,"rgba(100,140,210,0.4)");e.addColorStop(0.4,"rgba(180,160,240,0.4)");e.addColorStop(1,"rgba(1,159,98,0)");j.fillStyle=e;j.fillRect(editorWidth-18.5,d+8,16,g-17);c+=20}j.beginPath();j.moveTo(editorWidth-7,d+9);j.lineTo(editorWidth-7,d+g-10);j.lineCap="round";j.strokeStyle="rgba(200,220,255,0.3)";j.lineWidth=4;j.stroke();j.beginPath();j.moveTo(editorWidth-9,d+10);j.lineTo(editorWidth-9,d+g-10);j.strokeStyle="rgba(200,220,255,0.1)";j.lineWidth=2;j.stroke();h=b=g=d=c=null}function drawRange(q,p){if(pos.row>anch.row){var h={row:anch.row,col:anch.col};var e={row:pos.row,col:pos.col}}else{if(pos.row==anch.row&&pos.col>anch.col){var h={row:anch.row,col:anch.col};var e={row:pos.row,col:pos.col}}else{var h={row:pos.row,col:pos.col};var e={row:anch.row,col:anch.col}}}var o=lineheight*9+3;var c=0;for(var s=0;s<h.row;s++){if(pageBreaks.length!=0&&pageBreaks[c][2]==0&&pageBreaks[c][0]-1==s){o=72*lineheight*(c+1)+9*lineheight+4;c++;if(c==pageBreaks.length){c--}}else{if(pageBreaks.length!=0&&pageBreaks[c][2]!=0&&pageBreaks[c][0]==s){o=72*lineheight*(c+1)+9*lineheight+4;o+=(linesNLB[s].length-pageBreaks[c][2])*lineheight;if(lines[s][1]==3){o+=lineheight}c++;if(c==pageBreaks.length){c--}}else{o+=lineheight*linesNLB[s].length}}}var s=0;var b=linesNLB[h.row][s]+1;while(h.col>b){o+=lineheight;if(pageBreaks.length!=0&&pageBreaks[c][0]==h.row&&pageBreaks[c][2]==s+1){o=72*lineheight*(c+1)+9*lineheight+4;if(lines[h.row][1]==3){o+=lineheight}}s++;b+=linesNLB[h.row][s]+1}b-=linesNLB[h.row][s]+1;var m=WrapVariableArray[lines[h.row][1]][1];m+=((h.col-b)*fontWidth);o+=lineheight;for(note in notes){if(notes[note][0]==h.row){if(b<notes[note][1]&&b+linesNLB[h.row][s]+1>notes[note][1]){if(notes[note][1]<h.col){m+=fontWidth}}}}var n=lineheight*9+3;c=0;for(var r=0;r<e.row;r++){if(pageBreaks.length!=0&&pageBreaks[c][2]==0&&pageBreaks[c][0]-1==r){n=72*lineheight*(c+1)+9*lineheight+4;c++;if(c==pageBreaks.length){c--}}else{if(pageBreaks.length!=0&&pageBreaks[c][2]!=0&&pageBreaks[c][0]==r){n=72*lineheight*(c+1)+9*lineheight+4;n+=(linesNLB[r].length-pageBreaks[c][2])*lineheight;if(lines[r][1]==3){n+=lineheight}c++;if(c==pageBreaks.length){c--}}else{n+=lineheight*linesNLB[r].length}}}var r=0;var d=linesNLB[e.row][r]+1;while(e.col>d){n+=lineheight;if(pageBreaks.length!=0&&pageBreaks[c][0]==e.row&&pageBreaks[c][2]==r+1){n=72*lineheight*(c+1)+9*lineheight+4;if(lines[e.row][1]==3){n+=lineheight}}r++;d+=linesNLB[e.row][r]+1}d-=linesNLB[e.row][r]+1;var k=WrapVariableArray[lines[e.row][1]][1];k+=((e.col-d)*fontWidth);n+=lineheight;for(note in notes){if(notes[note][0]==e.row){if(d<notes[note][1]&&d+linesNLB[e.row][r]+1>notes[note][1]){if(notes[note][1]<e.col){k+=fontWidth}}}}q.fillStyle="lightBlue";if(n==o){var f=m;if(lines[h.row][1]==5){f-=(lines[h.row][0].length*fontWidth)}q.fillRect(f+p,o-vOffset,k-m,12)}else{var l=m;if(lines[h.row][1]==5){l-=(lines[h.row][0].length*fontWidth)}q.fillRect(l+p,o-vOffset,(b+linesNLB[h.row][s]-h.col)*fontWidth,12);while(o+lineheight<n){for(var g=0;g<pageBreaks.length;g++){if(pageBreaks.length!=0&&pageBreaks[g][0]-1==h.row&&pageBreaks[g][2]==0&&s==linesNLB[h.row].length-1){o=72*lineheight*(g+1)+9*lineheight+4}else{if(pageBreaks.length!=0&&pageBreaks[g][0]==h.row&&s==pageBreaks[g][2]-1){o=72*lineheight*(g+1)+9*lineheight+4;if(lines[h.row][1]==3){o+=lineheight}}}}s++;o+=lineheight;if(linesNLB[h.row].length<=s){h.row++;s=0}if(o!=n){var t=WrapVariableArray[lines[h.row][1]][1];if(lines[h.row][1]==5){t-=(lines[h.row][0].length*fontWidth)}q.fillRect(t+p,o-vOffset,linesNLB[h.row][s]*fontWidth,12)}}var a=WrapVariableArray[lines[e.row][1]][1];if(lines[e.row][1]==5){a-=(lines[e.row][0].length*fontWidth)}q.fillRect(a+p,n-vOffset,(e.col-d)*fontWidth,12)}}function drawNote(f,a,d,b,e,g){if(lines[e][1]==5){b.fillStyle="gold";b.beginPath();b.moveTo(f-fontWidth*(lines[e][0].length-d+1)+g,a-vOffset-lineheight+3);b.lineTo(f-fontWidth*(lines[e][0].length-d+1)+g,a-vOffset-lineheight+3+lineheight);b.lineTo(f-fontWidth*(lines[e][0].length-d+1)+fontWidth+g,a-vOffset-lineheight+3+lineheight);b.lineTo(f-fontWidth*(lines[e][0].length-d+1)+fontWidth+g,a-vOffset-lineheight+3+4);b.lineTo(f-fontWidth*(lines[e][0].length-d+1)+fontWidth-4+g,a-vOffset-lineheight+3);b.closePath();b.fill();b.strokeStyle="#333";b.lineWidth=1;b.beginPath();for(var c=1;c<6;c++){b.moveTo(f-fontWidth*(lines[e][0].length-d+1)+1+g,a-vOffset-lineheight+3+(2*c)+0.5);b.lineTo(f-fontWidth*(lines[e][0].length-d+1)+fontWidth-1+g,a-vOffset-lineheight+3+(2*c)+0.5);b.stroke()}b.strokeStyle="#999";b.beginPath();b.moveTo(f-fontWidth*(lines[e][0].length-d+1)+fontWidth-4+g,a-vOffset-lineheight+3);b.lineTo(f-fontWidth*(lines[e][0].length-d+1)+fontWidth-4+g,a-vOffset-lineheight+3+4);b.lineTo(f-fontWidth*(lines[e][0].length-d+1)+fontWidth+g,a-vOffset-lineheight+3+4);b.stroke()}else{b.fillStyle="gold";b.beginPath();b.moveTo(f+fontWidth*d+g,a-vOffset-lineheight+3);b.lineTo(f+fontWidth*d+g,a-vOffset-lineheight+3+lineheight);b.lineTo(f+fontWidth*d+fontWidth+g,a-vOffset-lineheight+3+lineheight);b.lineTo(f+fontWidth*d+fontWidth+g,a-vOffset-lineheight+3+4);b.lineTo(f+fontWidth*d+fontWidth-4+g,a-vOffset-lineheight+3);b.closePath();b.fill();b.strokeStyle="#333";b.lineWidth=1;b.beginPath();for(var e=1;e<6;e++){b.moveTo(f+fontWidth*d+1+g,a-vOffset-lineheight+3+(2*e)+0.5);b.lineTo(f+fontWidth*d+fontWidth-1+g,a-vOffset-lineheight+3+(2*e)+0.5);b.stroke()}b.strokeStyle="#999";b.beginPath();b.moveTo(f+fontWidth*d+fontWidth-4+g,a-vOffset-lineheight+3);b.lineTo(f+fontWidth*d+fontWidth-4+g,a-vOffset-lineheight+3+4);b.lineTo(f+fontWidth*d+fontWidth+g,a-vOffset-lineheight+3+4);b.stroke()}b.fillStyle=foreground}function sortNumbers(d,c){return d-c}function paint(ae,C,W,A){if(typeToScript){var p=document.getElementById("canvas");var w=p.getContext("2d");w.clearRect(0,0,2000,2500);w.fillStyle="#ccc";w.fillRect(0,0,editorWidth,document.getElementById("canvas").height);w.fillStyle=foreground;var T=Math.round((editorWidth-fontWidth*87-24)/2);var R=lineheight;w.font=font;for(var aa=0;aa<=pageBreaks.length;aa++){w.fillStyle=background;w.fillRect(T,R-vOffset,fontWidth*87,lineheight*70);w.strokeStyle="#000";w.lineWidth=1;w.strokeRect(T,R-vOffset,Math.round(fontWidth*87),lineheight*70);w.strokeStyle="#999";w.strokeRect(T-2,R-vOffset-2,Math.round(fontWidth*87)+4,lineheight*70+4);w.fillStyle=foreground;if(aa>0){w.fillText(String(aa+1)+".",550+T,R-vOffset+85)}R+=lineheight*72}var L=lineheight*9+2;var J=WrapVariableArray[0];w.fillStyle="#ddd";if(!W){var S=0;for(var aa=0;aa<lines.length;aa++){if(pageBreaks.length!=0&&pageBreaks[S][0]==aa){L=72*lineheight*(S+1)+9*lineheight+2;if(pageBreaks[S][2]!=0){L-=pageBreaks[S][2]*lineheight;if(lines[aa][1]==3){L+=lineheight}}S++;if(S==pageBreaks.length){S--}}if(aa<linesNLB.length){for(var Y=0;Y<linesNLB[aa].length;Y++){L+=lineheight;if(lines[aa][1]==0){if(linesNLB[aa][Y]!=0){w.fillRect(J[1]-3+T,L-vOffset,61*fontWidth+6,14)}if(lines[aa][0]==""&&Y==0){w.fillRect(J[1]-3+T,L-vOffset,61*fontWidth+6,14)}}}}}}w.fillStyle=foreground;if(pos.row!=anch.row||anch.col!=pos.col){drawRange(w,T);if(!pasting){selection()}}w.fillStyle=foreground;w.font=font;var M=lineheight*11;var h=[];var l="";var S=0;var s=false;var ad=0;for(var aa=0;aa<lines.length;aa++){if(lines[aa][1]==0){ad++}if(lines[aa][1]==4){if(lines[aa][0].charAt(0)!="("){lines[aa][0]="("+lines[aa][0]}if(lines[aa][0].charAt(lines[aa][0].length-1)!=")"){lines[aa][0]=lines[aa][0]+")"}}var ak=false;if(!W){if(pageBreaks.length!=0&&pageBreaks[S]!=undefined&&pageBreaks[S][0]==aa){if(pageBreaks[S][2]==0){M=72*lineheight*(S+1)+11*lineheight;S++;if(S>=pageBreaks.length){if(!s){s=S+1}S=pageBreaks.length-2}}else{ak=true}}}if(!W&&!ak&&(M-vOffset>1200||M-vOffset<-200)){M+=(lineheight*linesNLB[aa].length);if(aa==pos.row){var H=M;o=[]}}else{var v=[];if(viewNotes){for(note in notes){if(notes[note][0]==aa){v.push(notes[note][1])}}}v=v.sort(sortNumbers);var al=lines[aa][1];var k=(C?anch.row:pos.row);if(aa==pos.row){var H=M-lineheight;if(al==1){var I=WrapVariableArray[1][1]}else{if(al==0){var I=WrapVariableArray[0][1]}else{if(al==3){var I=WrapVariableArray[3][1]}else{if(al==2){var I=WrapVariableArray[2][1]}else{if(al==4){var I=WrapVariableArray[4][1]}else{if(al==5){var I=WrapVariableArray[5][1]}}}}}}var B=true;var o=[]}if(aa==anch.row){var G=M-lineheight;var K=true;var a=[]}var ab=lines[aa][0];if(al==0){var J=WrapVariableArray[0]}else{if(al==1){var J=WrapVariableArray[1]}else{if(al==2){var J=WrapVariableArray[2]}else{if(al==3){var J=WrapVariableArray[3]}else{if(al==4){var J=WrapVariableArray[4]}else{if(al==5){var J=WrapVariableArray[5]}}}}}}var u=ab.split(" ");var O=0;if(ae||C){var X=[]}linesNLB[aa]=[];var g=0;var D=false;var b=false;while(O<u.length){var Q=0;if(u.slice(O).join().length<J[0]){var ah=u.slice(O).join(" ");if(lines[aa][1]==2&&l!=""&&lines[aa][0].toUpperCase()==l.toUpperCase()){ah+=" (Cont'd)"}if(lines[aa][1]==0){l=""}if(J[3]==1){ah=ah.toUpperCase()}if(J[2]==1){w.textAlign="right"}var ag=ah;var V=[];if(viewNotes){for(note in v){if(v[note]>=lines[aa][0].length-ah.length){ag=ag.substr(0,v[note]-g+V.length)+" "+ag.substr(v[note]-g+V.length);drawNote(J[1],M,v[note]-g+V.length,w,aa,T);V.push(v[note])}}}if(ah!=""){w.fillText(ag,J[1]+T,M-vOffset)}w.textAlign="left";O=u.length;linesNLB[aa].push(ah.length);M+=lineheight;if(J[4]==2){linesNLB[aa].push(0);M+=lineheight}if(ae||C){X.push(ah.length)}if(B){o.push(ah.length)}if(K){a.push(ah.length)}}else{var Q=0;while(u.slice(O,O+Q).join(" ").length<J[0]){newLineToPrint=u.slice(O,O+Q).join(" ");Q++;if(J[3]==1){newLineToPrint=newLineToPrint.toUpperCase()}}var Z=newLineToPrint;var V=[];if(viewNotes){for(note in v){if(v[note]>=g&&v[note]<=g+newLineToPrint.length){Z=Z.substr(0,v[note]-g+V.length)+" "+Z.substr(v[note]-g+V.length);drawNote(J[1],M,v[note]-g+V.length,w,aa,T);V.push(v[note])}}}g+=newLineToPrint.length+1;w.fillText(Z,J[1]+T,M-vOffset);linesNLB[aa].push(newLineToPrint.length);M+=lineheight;O+=Q-1;Q=0;if(ae||C){X.push(newLineToPrint.length)}if(B){o.push(newLineToPrint.length)}if(K){a.push(newLineToPrint.length)}}if(lines[aa][1]==3&&aa+1!=lines.length&&lines[aa+1][1]==4&&linesNLB[aa][linesNLB[aa].length-1]==0){linesNLB[aa].pop();M-=lineheight}if(ak&&linesNLB[aa].length==pageBreaks[S][2]){if(lines[aa][1]==3){w.fillText("(MORE)",WrapVariableArray[2][1]+T,M-vOffset)}M=72*lineheight*(S+1)+11*lineheight;if(lines[aa][1]==3){w.fillText(l.toUpperCase()+" (CONT'D)",WrapVariableArray[2][1]+T,M-vOffset);M+=lineheight}S++;ak=false;if(pos.row==aa){h.push(S)}}}var B=false;var K=false}if(lines[aa][1]==2){var l=lines[aa][0]}if(aa==pos.row&&s==false){s=S+1}if(aa==pos.row){var aj=ad;var f=v}if(S>=pageBreaks.length){if(s==false){s=S+1}S=pageBreaks.length-2}}while(lines.length<linesNLB.length){linesNLB.pop()}var af=new Date();var z=af.getMilliseconds();var E=z-milli;var m=false;if(E>0&&E<500){m=true}if(E<0&&E<-500){m=true}if(o){var N=0;var t=pos.col;var r=o[N];while(pos.col>r){N++;r+=1+o[N]}r-=o[N];var P=0;for(note in f){var U=f[note];console.log();if(U<pos.col&&U>r&&U<r+o[N]){P++}}if(h.length>0&&N>=pageBreaks[h[0]-1][2]){s+=1;H=72*h[0]*lineheight+9*lineheight;if(lines[pos.row][1]==3){H+=lineheight*2;N-=pageBreaks[h[0]-1][2]}else{if(lines[pos.row][1]==1){N-=pageBreaks[h[0]-1][2];H+=lineheight}}}if(m){var F=I+((pos.col-r+P)*fontWidth)+T;if(lines[pos.row][1]==5){F-=lines[pos.row][0].length*fontWidth}ud=2+H+(N*lineheight)-vOffset;try{w.fillRect(F,ud,2,17)}catch(ac){console.log(lines[pos.row][0])}}}w.lineWidth=4;w.strokeStyle="#ddd";w.beginPath();w.moveTo(2,2);w.lineTo(2,document.getElementById("canvas").height-1);w.lineTo(editorWidth,document.getElementById("canvas").height-1);w.lineTo(editorWidth,2);w.lineTo(2,2);w.stroke();w.fillStyle="#ccc";w.fillRect(2,document.getElementById("canvas").height-24,editorWidth-25,24);w.strokeStyle="#aaa";w.lineWidth=1;w.beginPath();w.moveTo(1.5,document.getElementById("canvas").height-25.5);w.lineTo(1.5,document.getElementById("canvas").height-1.5);w.lineTo(editorWidth-23.5,document.getElementById("canvas").height-1.5);w.lineTo(editorWidth-23.5,document.getElementById("canvas").height-25.5);w.closePath();w.strokeStyle="#999";w.stroke();w.beginPath();w.moveTo(0.5,document.getElementById("canvas").height-24.5);w.lineTo(0.5,document.getElementById("canvas").height-0.5);w.lineTo(editorWidth-22.5,document.getElementById("canvas").height-0.5);w.lineTo(editorWidth-22.5,document.getElementById("canvas").height-24.5);w.closePath();w.strokeStyle="#333";w.stroke();var ai=pageBreaks.length+1;var c="Page "+s+" of "+ai;w.font="10pt sans-serif";w.fillStyle="#000";w.fillText(c,editorWidth-150,document.getElementById("canvas").height-8);var q="Scene "+aj+" of "+scenes.length;w.fillText(q,50,document.getElementById("canvas").height-8);w.font=font;scrollArrows(w);scrollBar(w,M);if(C){pos.row=anch.row;pos.col=anch.col}if(W){pagination()}if(mouseDownBool&&pos.row<anch.row&&mouseY<40){scroll(-20)}if(mouseDownBool&&pos.row>anch.row&&mouseY>document.getElementById("canvas").height-50){scroll(20)}if(A=="enter"){if(ud>document.getElementById("canvas").height){scroll(600)}}else{if(A){if((2+H+(N*lineheight)-vOffset)>document.getElementById("canvas").height-60){scroll(45)}else{if(ud<45){scroll(-45)}}}}}};