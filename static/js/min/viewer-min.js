function infoSizes(){var a=$("#scriptInfo").height()-50;var b=(a/3)-$("#sceneBoxHandle").height();$("#sceneindex").height(b);$("#noteindex").height(b);$("#characterindex").height(b);while($("#characterindex").height()>+0){$("#noteindex").height($("#noteindex").height()+1);$("#characterindex").height($("#characterindex").height()-1)}while($("#sceneindex").height()>+0){$("#noteindex").height($("#noteindex").height()+1);$("#sceneindex").height($("#sceneindex").height()-1)}}function infoResize(b){var a=document.getElementById("mouseInfo").innerHTML.split("?");var d=a[1];var c=a[2]-b.clientY;if(d=="noteBoxHandle"){if($("#sceneindex").height()-c>=0){if($("#noteindex").height()+c>=0){$("#sceneindex").height($("#sceneindex").height()-c);$("#noteindex").height($("#noteindex").height()+c)}}}else{if(d=="characterBoxHandle"){if($("#noteindex").height()-c>=0){if($("#characterindex").height()+c>=0){$("#noteindex").height($("#noteindex").height()-c);$("#characterindex").height($("#characterindex").height()+c)}}}}a[2]=b.clientY;document.getElementById("mouseInfo").innerHTML=a.join("?")}function trackMouseDown(a){if(a.target.id!="sceneBoxHandle"){var b=a.clientY;document.getElementById("mouseInfo").innerHTML="down?"+a.target.id+"?"+b}}function trackMouseUp(a){document.getElementById("mouseInfo").innerHTML="up?0?0"}function tokenize(f){var j=0;var u=document.getElementsByTagName("div");for(var q=0;q<u.length;q++){if(u[q].className=="token"){j++}}if(j>4){alert("You can only have 5 recipients at a time for now. Only the first five will be sent.");return}var a=document.getElementById(f);var v=a.value.replace(",","");var s=v.replace(/ /g,"");if(s==""){return}var b=v.split(" ");var o=b.pop();var w="";if(b.length==0){w=o}else{w=b.join(" ").replace(/"/g,"")}var d=document.createElement("div");var h=document.getElementById(f+"s").appendChild(d);h.className="token";h.id=o;var e=document.createElement("span");var t=h.appendChild(e);var n=document.createTextNode(w);t.appendChild(n);var e=document.createElement("span");var p=h.appendChild(e);var l=document.createTextNode(o);p.className="mailto";p.appendChild(l);var g=document.createElement("a");var k=h.appendChild(g);var r=document.createTextNode(" | X");k.appendChild(r);var m='javascript:removeToken("'+o+'")';k.setAttribute("href",m);a.value=""}function removeToken(a){var b=document.getElementById(a);b.parentNode.removeChild(b)}function insertSharedNotes(h){if(h=="none"){}else{if(h=="nonedata"){}else{var p=document.getElementById("textEditor").childNodes;h=h.slice(6);var b=h.split("&user&");for(var l=0;l<b.length;l++){console.log("users.length="+b.length);var o=b[l].split("&data&");var g=o[0];var q=o[1].split("&unit&");for(var f=0;f<q.length;f++){console.log("notesUnites.length="+q.length);var a=q[f].split("?comment=")[0];var n=q[f].split("?comment=")[1].split("?position=")[0];var m=q[f].split("?comment=")[1].split("?position=")[1];for(var e=0;e<p.length;e++){if(String(e)==m){var d=p[e];d=(d.nodeName=="#text"?p[e+1]:d);var r=d.appendChild(document.createElement("span"));r.className="sharedNotes";r.title=a+"?comment="+n+"?user="+g;r.appendChild(document.createTextNode("X"));console.log("inserted note")}}}}}}}function updateNote(e){var h=e.id;if(h==""){h=e.parentNode.id}var c=document.getElementsByTagName("span");for(var b=0;b<c.length;b++){if(c[b].title.split("?comment=")[0]==h){var a=new RegExp("<br>","ig");var g=new RegExp("<div>","ig");var f=new RegExp("</div>","ig");if($.browser.mozilla){var d=e.innerHTML.replace(a,"HTMLLINEBREAK")}else{var d=e.innerHTML.replace(a,"").replace(f,"").replace(g,"HTMLLINEBREAK")}c[b].title=h+"?comment="+d+"?user="+document.getElementById("user").innerHTML;e.id=h}}}function insertNote(c){c.preventDefault();var b=c.target;while(b.nodeName!="H1"&&b.nodeName!="H2"&&b.nodeName!="H3"&&b.nodeName!="H4"&&b.nodeName!="H5"&&b.nodeName!="H6"){b=b.parentNode}var a=b.appendChild(document.createElement("span"));a.className="sharedNotes";a.appendChild(document.createTextNode("X"));var f=new Date();var g=f.getTime();a.title=g+"?comment=CODEFILLER?user="+document.getElementById("user").innerHTML;notesIndex();document.getElementById(g).focus()}function selectNote(c){notesIndex();var b=c.title;var a=b.split("?comment=");var d=a[0];document.getElementById(d).focus()}function notesIndex(){var m=document.getElementById("noteindex").childNodes;for(var a=0;a<m.length;a++){document.getElementById("noteindex").removeChild(m[a]);a--}var f=0;var h=document.getElementsByTagName("span");for(var d=0;d<h.length;d++){if(h[d].className=="notes"||h[d].className=="sharedNotes"){var e=h[d].title.split("?comment=");var b=(e.length>1?e[1].split("?user=")[0]:h[d].title);if(b!=""){b=b.replace("CODEFILLER","");h[d].title=h[d].title.replace("CODEFILLER","");if($.browser.mozilla){var k=new RegExp("HTMLLINEBREAK","gi");var g=b.replace(k,"<br>")}else{var n=b.split("HTMLLINEBREAK");var g=n[0];for(var a=1;a<n.length;a++){g=g+"<div>";if(n[a]==""){g=g+"<br>"}else{g=g+n[a]}g=g+"</div>"}}var l=document.getElementById("noteindex").appendChild(document.createElement("div"));l.innerHTML=g;if(h[d].className=="notes"){l.className="postit"}if(h[d].className=="sharedNotes"){l.className="sharedPostit";if(e[1].split("?user=")[1]==document.getElementById("user").innerHTML){l.contentEditable="true"}else{l.innerHTML=l.innerHTML+"<br><br><br>--"+e[1].split("?user=")[1]}}l.id=e[0];f++}else{h[d].parentNode.removeChild(h[d]);d--}}}$(".sharedPostit").keyup(function(c){updateNote(c.target)});$(".sharedPostit").blur(function(c){updateNote(c.target)});$(".sharedPostit").click(function(c){scrollToNote(c.target)});$(".postit").click(function(c){scrollToNote(c.target)});return f}function scrollToNote(d){var f=d.id;if(f==""){f=d.parentNode.id}var e=document.getElementsByTagName("span");var b=0;var a=0;while(a==0){if(e[b].title.split("?comment=")[0]==f){a=1;e[b].id="note";e[b].innerHTML="X";$("#container").scrollTo("#note",500,{onAfter:function(){e[b].removeAttribute("id")}})}else{b++}if(b>e.length){a=1}}}function submitNotes(){notesIndex();var l=document.getElementsByTagName("span");var k=document.getElementById("textEditor").childNodes;var b;var g="";for(var h=0;h<l.length;h++){if(l[h].className=="sharedNotes"){if(l[h].title.split("?user=")[1]==document.getElementById("user").innerHTML){b=l[h].parentNode;while(b.nodeName!="H1"&&b.nodeName!="H2"&&b.nodeName!="H3"&&b.nodeName!="H4"&&b.nodeName!="H5"&&b.nodeName!="H6"){b=b.parentNode}var e=0;while(k[e]!=b){e++}g=g+"&unit&"+l[h].title.split("?user=")[0]+"?position="+e}}}g=g.slice(6);if(g==""){g="none"}var f=document.getElementById("user").innerHTML;var a=window.location.href;var m=a.split("=")[1];$.post("/postnotes",{data:g,user:f,resource_id:m})}function sceneIndex(){var a=document.getElementById("textEditor").getElementsByTagName("h1");var g=0;var t=document.getElementById("sceneindex");var d=t.childNodes;for(var m=0;m<d.length;m=0){d[0].parentNode.removeChild(d[0])}while(g<a.length){var j=document.createElement("p");var q=t.appendChild(j);var e=g+1;var c="";var h=a[g].childNodes;try{for(var m=0;m<h.length;m++){var o=0;if(h[m].className=="notes"||h[m].className=="sharedNotes"){o=1}if(h[m].nodeName=="undefined"){}else{if(h[m].nodeName=="#text"){c=c+h[m].nodeValue}else{if(h[m].nodeName=="SPAN"&&o==0){var b=h[m].firstChild.nodeValue;c=c+b;h[m].parentNode.removeChild(h[m]);a[g].lastChild.nodeValue=a[g].firstChild.nodeValue+b}else{if(o==1){}else{c=c+h[m].firstChild.nodeValue}}}}}}catch(f){}var n=e+") "+c;n=n.replace(/<BR>/i,"");var r=document.createTextNode(n);q.appendChild(r);q.className="scene";q.id="p"+e;q.style.cursor="pointer";a[g].setAttribute("id",e);g++}$(".scene").mouseover(function(){$(this).css("background-color","#ccccff")});$(".scene").mouseout(function(){$(this).css("background-color","white")});$(".scene").click(function(){$(this).css("background-color","#999ccc");sceneSelect(this.id)})}function sceneSelect(b){var c="p"+b;var a="#"+b.replace(/p/,"");$("#container").scrollTo(a,500)}function characterIndex(){var m=document.getElementsByTagName("h3");if(m[0]==null){return}var j=new Array();for(var p=0;p<m.length;p++){if(m[p].className!="more"){j[p]=String(m[p].firstChild.nodeValue).toUpperCase().replace(" (CONT'D)","").replace(/&nbsp;/gi,"").replace(/\s+$/,"").replace(" (O.S.)","").replace(" (O.C.)","").replace(" (V.O.)","")}}j.sort();var o=0;var n=1;while(o<j.length-1){if(j[o]==j[n]){j.splice(n,1)}else{o++;n++}}var g=document.getElementById("characterindex");var q=g.childNodes;for(var h=0;h<q.length;h=0){q[0].parentNode.removeChild(q[0])}var d=0;while(d<j.length){if(j[d]!="(MORE)"){var f=document.createElement("p");var l=g.appendChild(f);l.innerHTML=j[d];l.className="character"}d++}}function totalPages(){var a=document.getElementsByTagName("hr");document.getElementById("totalPages").appendChild(document.createTextNode(" of "+(a.length+1)))}function currentPage(){var f=window.getSelection().anchorNode;var a=(f.nodeName=="#text"?f.parentNode:f);if(a.nodeName=="SPAN"){selectNote(a);return}var g=document.getElementById("textEditor").childNodes;var b=0;var e=1;while(g[b]!=a){try{if(g[b].nodeName=="HR"){e++}}catch(d){}b++;if(b>g.length){return}}document.getElementById("currentPage").innerHTML=e}function htmlTitleUpdate(){if(document.getElementById("title")==""){document.title="Script Editor"}else{document.title=document.getElementById("title").innerHTML}}function printPrompt(){var a=notesIndex();if(a==0){printScript(0)}else{document.getElementById("printpopup").style.visibility="visible"}}function hidePrintPrompt(){document.getElementById("printpopup").style.visibility="hidden"}function printScript(a){document.getElementById("wholeShebang").style.display="none";var b=document.body.appendChild(document.createElement("div"));b.id="printDiv";b.style.width="600px";b.style.margin="auto";var j="<div>";var o=document.getElementById("textEditor").innerHTML;o=o.replace(/<hr class="pb">/gi,'<p style="display:none"></p>');o=o.replace(/class="pn"/gi,'class="printPageBreak"');o=o.replace(/<h3 class="more">/gi,'<h3 class="printMore">');o=o.replace(/<span class="notes"/gi,'<span class="printNotes"');o=o.replace(/<span class="sharedNotes"/gi,'<span class="printNotes"');b.innerHTML=o;var n=b.childNodes;for(var e=0;e<n.length;e++){if(n[e].className!="printPageBreak"&&n[e].className!="printMore"&&n[e].className!="printPageBreak"){n[e].className="print"}}if(a==1){var q=b.appendChild(document.createElement("p"));q.appendChild(document.createTextNode("Notes for "+document.getElementById("title").firstChild.nodeValue.toUpperCase()+":"));q.style.pageBreakBefore="always";var r=b.appendChild(document.createElement("ol"));var m=1;var h=document.getElementsByTagName("span");for(var e=0;e<h.length;e++){if(h[e].className=="printNotes"){h[e].removeAttribute("style");h[e].innerHTML=m;var d=h[e].parentNode;var l=0;while(l==0){if(d=d.previousSibling){if(d.className=="printPageBreak"){var g=d.nextSibling;g=(g.nodeName=="#text"?g.nextSibling:g);var p=d.innerHTML.replace(".","");l=1}}else{var p=1;l=1}}var s=h[e].title.split("?comment=")[1].split("?user=");var f="Page "+p+" -- "+s[0].replace(/HTMLLINEBREAK/g,"<br>");if(s.length>1){f=f+"<br><br>--"+s[1]}var k=r.appendChild(document.createElement("li"));k.className="footnote";k.innerHTML=f;m++}}}else{$(".printNotes").css("display","none")}$(".printPageBreak").css("page-break-before","always");window.print();hidePrintPrompt();document.getElementById("wholeShebang").style.display="block";b.parentNode.removeChild(b)}function hideExportPrompt(){document.getElementById("exportpopup").style.visibility="hidden"}function exportPrompt(){document.getElementById("exportpopup").style.visibility="visible"}function exportScripts(){if(document.getElementById("demo").innerHTML=="demo"){nope();return}var b=window.location.href;var e=b.split("=")[1];var d;var a=document.getElementsByTagName("input");for(var c=0;c<a.length;c++){if(a[c].checked==true){if(a[c].className=="exportList"){d=a[c].name;b="/export?resource_id="+e+"&export_format="+d+"&fromPage=editor";window.open(b)}}}hideExportPrompt()}function emailComplete(a){document.getElementById("emailS").disabled=false;document.getElementById("emailS").value="Send";if(a=="sent"){alert("Email Sent");hideDiv()}else{alert("There was a problem sending your email. Please try again later.")}}function emailScript(){if(document.getElementById("demo").innerHTML=="demo"){nope();return}tokenize("recipient");var b=new Array();var j=document.getElementsByTagName("span");for(var f=0;f<j.length;f++){if(j[f].className=="mailto"){b.push(j[f].innerHTML)}}var a=b.join(",");var e=document.getElementById("subject").value;var g=document.getElementById("message").innerHTML;var d=window.location.href;var h=d.split("=")[1];$.post("/emailscript",{resource_id:h,recipients:a,subject:e,body_message:g,fromPage:"editor"},function(c){emailComplete(c)});document.getElementById("emailS").disabled=true;document.getElementById("emailS").value="Sending..."}function emailPrompt(a){$.post("/contactlist",{fromPage:"editorEmail"},function(c){var b=c.split(";");$("input#recipient").autocomplete({source:b})});document.getElementById("hideshow").style.visibility="visible"}function hideDiv(){document.getElementById("hideshow").style.visibility="hidden";document.getElementById("recipient").value="";document.getElementById("subject").value="";document.getElementById("message").innerHTML="";document.getElementById("recipients").innerHTML=""};