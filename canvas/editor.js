   var shiftDown=false;
   var characters =[];
   var scenes=[];
   var canvas;
   var ctx;
   var linesNLB= [];
   var vOffset = 0;
   var pos = { col: 0, row: 0};
   var anch = {col:0, row:0};
   var background = '#fff';
   var font = '12pt Courier';
   var foreground = '#000';
   var lineheight = 15;
   var milli = 0;
   var formatMenu = false;
   var formats = ['Slugline', 'Action', 'Character', 'Dialog', 'Parenthetical', 'Transition'];
   // Use the same wrapping procedure over and over
   // just define an array to pass into it
    //wrapVars[0]=character length before wrap
    //wrapVars[1]= distace from edge it should be placed ay
    //wrapVars[2]= bool, align right
    //wrapVars[3]= bool, uppercase
    //wrapVars[4]=number of line breaks after
    //
    //
    //
    //wrapvariablearray[0]=s
    //wrapvariablearray[1]=a
    //wrapvariablearray[2]=c
    //wrapvariablearray[3]=d
    //wrapvariablearray[4]=p
    //wrapvariablearray[5]=t
    var WrapVariableArray = [[61, 31,0,1,2],[61,31,0,0,2],[40, 232,0,1,1],[36, 131,0,0,2],[30, 181,0,0,1],[61, 632,1,1,2]];
    var fontWidth = 10;
    //if ($.browser.mozilla)fontWidth=11;
    var editorWidth = 675;
    
        
function setup(){
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    document.onkeypress = handlekeypress;
    characterInit();
    sceneIndex();
    paint(false,false,true);
    setInterval('paint(false,false, false)', 40);
}

function mouseUp(e){
    var width = document.getElementById('canvas').width;
    var height = document.getElementById('canvas').height;
    if (!formatMenu){
        if (e.clientX>10 && e.clientX<100 && e.clientY<30 && e.clientY >10){
            formatMenu = true;
        }
        else if(e.clientY>height-39 && e.clientY<height && e.clientX>editorWidth-22 && e.clientX<editorWidth-2){
                if(e.clientY>height-20)scroll(30);
                else scroll(-30);
            }
        else{
            paint(e, false, false);
        }
    }
    else{
        if (e.clientX>10 && e.clientX<110 && e.clientY<150 && e.clientY >10){
            var a = e.clientY;
            var b=25;
            var c =19;
            if (a<b)lines[pos.row][1]='s';
            else if(a<(b+c))lines[pos.row][1]='a';
            else if(a<(b+2*c))lines[pos.row][1]='c';
            else if(a<(b+3*c))lines[pos.row][1]='d';
            else if(a<(b+4*c))lines[pos.row][1]='p';
            else lines[pos.row][1] = 't';
        }
        formatMenu=false;
    }
    if (e.clientX>200 && e.clientX<310 && e.clientY<27 && e.clientY>7){
        //lines = [['Fade In:','a'],['int. house - day', 's']];
        lines = fivePages;
        paint(false, false, true);
    }    
}
function mouseDown(e){
    paint(false, e, false);
}
function scroll(v){
    vOffset+=v;
    if (vOffset<0)vOffset=0;
}
function upArrow(){
    if (pos.row==0 && pos.col==0)return;
    var type = lines[pos.row][1];
    if (type=='s') var wrapVars=WrapVariableArray[0];
    else if(type=='a') var wrapVars = WrapVariableArray[1];
    else if(type=='c') var wrapVars = WrapVariableArray[2];
    else if(type=='d') var wrapVars = WrapVariableArray[3];
    else if(type=='p') var wrapVars = WrapVariableArray[4];
    else if(type=='t') var wrapVars = WrapVariableArray[5];
    // Only do calculations if 
    // there is wrapped text
    if(lines[pos.row][0].length>wrapVars[0]){
        var wordsArr = lines[pos.row][0].split(' ');
        var word = 0;
        var lineLengths=[];
        while(word<wordsArr.length){
            if(wordsArr.slice(word).join().length<=wrapVars[0]){
                lineLengths.push(wordsArr.slice(word).join().length);
                word=wordsArr.length
                
            }
            else{
                var integ=0;
                while(wordsArr.slice(word, word+integ).join().length<wrapVars[0]){
                    integ++;
                }
                lineLengths.push(wordsArr.slice(word, word+integ-1).join().length);
                word+=integ-1;
            }
        }
        // now we have the variable lineLengths
        // this is an array holding all the wrapped line lengths
        //
        //use variable 'integ' to figure out 
        //what line the cursor is on
        integ=0;
        var totalCharacters=lineLengths[0];
        while(totalCharacters<pos.col){
            integ++;
            totalCharacters+=lineLengths[integ]+1;
        }
        // totalCharacters now equals
        // all character up to and including
        // current line (integ) including spaces
        
        //if this is the first line in a block of wrapped text
        if(integ==0){
            var prevLineType = lines[pos.row-1][1];
            if (prevLineType=='s')var newWrapVars=WrapVariableArray[0];
            else if(prevLineType=='a') var newWrapVars = WrapVariableArray[1];
            else if(prevLineType=='c') var newWrapVars = WrapVariableArray[2];
            else if(prevLineType=='d') var newWrapVars = WrapVariableArray[3];
            else if(prevLineType=='p') var newWrapVars = WrapVariableArray[4];
            else if(prevLineType=='t') var newWrapVars = WrapVariableArray[5];
            // If the previous line (the one we're jumping into)
            // has only one line, don't run the calcs, just go to it
            if(lines[pos.row-1][0].length<newWrapVars[0]){
                pos.row--;
                if(pos.col>lines[pos.row][0].length)pos.col=lines[pos.row][0].length;
            }
            else{
                var wordsArr = lines[pos.row-1][0].split(' ');
                var word = 0;
                var lineLengths=[];
                while(word<wordsArr.length){
                    if(wordsArr.slice(word).join().length<=wrapVars[0]){
                        lineLengths.push(wordsArr.slice(word).join().length);
                        word=wordsArr.length
                        
                    }
                    else{
                        var integ = 0;
                        while(wordsArr.slice(word, word+integ).join().length<wrapVars[0]){
                            integ++;
                        }
                        lineLengths.push(wordsArr.slice(word, word+integ-1).join().length);
                        word+=integ-1;
                    }
                // now we have the variable lineLengths
                // this is an array holding all the wrapped line lengths
                }
                pos.row--;
                pos.col+=lines[pos.row][0].length-lineLengths[lineLengths.length-1];
                if(pos.col>lines[pos.row][0].length)pos.col = lines[pos.row][0].length;
                
            }
        }
        // if this is some middle line in a block of wrapped text
        else{
            pos.col-=lineLengths[integ-1]+1;
            if(pos.col>(totalCharacters-lineLengths[integ]-1))pos.col=totalCharacters-lineLengths[integ]-1;
        }
    }
    //if the current block does
    //not have wrapped text
    else{
        if(pos.row==0){
            pos.col=0;
        }
        else{
            var prevLineType = lines[pos.row-1][1];
            if (prevLineType=='s')var newWrapVars=WrapVariableArray[0];
            else if(prevLineType=='a') var newWrapVars = WrapVariableArray[1];
            else if(prevLineType=='c') var newWrapVars = WrapVariableArray[2];
            else if(prevLineType=='d') var newWrapVars = WrapVariableArray[3];
            else if(prevLineType=='p') var newWrapVars = WrapVariableArray[4];
            else if(prevLineType=='t') var newWrapVars = WrapVariableArray[5];
            // If the previous line (the one we're jumping into)
            // has only one line, don't run the calcs, just go to it
            if(lines[pos.row-1][0].length<newWrapVars[0]){
                pos.row--;
                if(pos.col>lines[pos.row][0].length)pos.col=lines[pos.row][0].length;
            }
            //if the previous line has wrapped text
            //do crazy calcs to figure where to
            // jump to
            else{
                var wordsArr = lines[pos.row-1][0].split(' ');
                var word = 0;
                var lineLengths=[];
                while(word<wordsArr.length){
                    if(wordsArr.slice(word).join().length<=wrapVars[0]){
                        lineLengths.push(wordsArr.slice(word).join().length);
                        word=wordsArr.length
                        
                    }
                    else{
                        var integ = 0;
                        while(wordsArr.slice(word, word+integ).join().length<wrapVars[0]){
                            integ++;
                        }
                        lineLengths.push(wordsArr.slice(word, word+integ-1).join().length);
                        word+=integ-1;
                    }
                // now we have the variable lineLengths
                // this is an array holding all the wrapped line lengths
                }
                pos.row--;
                pos.col+=lines[pos.row][0].length-lineLengths[lineLengths.length-1];
                if(pos.col>lines[pos.row][0].length)pos.col = lines[pos.row][0].length;
            }
        }
    }
    if(!shiftDown){
        anch.col=pos.col;
        anch.row=pos.row;
    }
}
	
function downArrow(){
    if(pos.row==lines.length-1 && pos.col==lines[pos.row][0].length)return;
    var type = lines[pos.row][1];
    if (type=='s')var wrapVars=WrapVariableArray[0];
    else if(type=='a') var wrapVars = WrapVariableArray[1];
    else if(type=='c') var wrapVars = WrapVariableArray[2];
    else if(type=='d') var wrapVars = WrapVariableArray[3];
    else if(type=='p') var wrapVars = WrapVariableArray[4];
    else if(type=='t') var wrapVars = WrapVariableArray[5];
    if (lines[pos.row][0].length>wrapVars[0]){
        var wordsArr = lines[pos.row][0].split(' ');
        var word = 0;
        var lineLengths=[];
        while(word<wordsArr.length){
            if(wordsArr.slice(word).join().length<=wrapVars[0]){
                lineLengths.push(wordsArr.slice(word).join().length);
                word=wordsArr.length
                
            }
            else{
                var integ = 0;
                while(wordsArr.slice(word, word+integ).join().length<wrapVars[0]){
                    integ++;
                }
                lineLengths.push(wordsArr.slice(word, word+integ-1).join().length);
                word+=integ-1;
            }
        }
        //use variable 'integ' to figure out 
        //what line the cursor is on
        integ=0;
        var totalCharacters=lineLengths[0];
        while(totalCharacters<pos.col){
            integ++;
            totalCharacters+=lineLengths[integ]+1;
        }
        //if this is the last line in a block of wrapped text
        if(integ+1==lineLengths.length){
            for(var newinteg=0; newinteg<lineLengths.length-1;newinteg++){
                pos.col-=lineLengths[newinteg];
            }
            pos.col--;
            pos.row++;
            if(pos.row>lines.length-1){
                pos.row--;
                pos.col=lines[pos.row][0].length;
            }
            if(pos.col>lines[pos.row][0].length)pos.col=lines[pos.row][0].length;
        }
        // if this is some middle line in a block of wrapped text
        else{
            pos.col+=lineLengths[integ]+1;
            if(pos.col>(totalCharacters+lineLengths[integ+1]+1))pos.col=totalCharacters+lineLengths[integ+1]+1;
        }
    }
    else{
        if(pos.row==lines.length-1){
            pos.col=lines[pos.row][0].length;
        }
        else{
            pos.row++;
            if(pos.row>lines.length-1) pos.row=lines.length-1;
            if(pos.col>lines[pos.row][0].length)pos.col=lines[pos.row][0].length;
        }
    }
    if(!shiftDown){
        anch.col=pos.col;
        anch.row=pos.row;
    }
}

function leftArrow(){
	if(pos.row==0 && pos.col==0) return;
	if(pos.col==0){
		pos.row--;
		pos.col=lines[pos.row][0].length;
	}
	else pos.col = pos.col-1;
    
    if(!shiftDown){
        anch.col=pos.col;
        anch.row=pos.row;
    }
}
	
function rightArrow(){
	if(pos.col==lines[pos.row][0].length && pos.row==lines.length-1)return;
	if(pos.col==lines[pos.row][0].length){
		pos.row++;
		pos.col=0;
	}
	else pos.col = pos.col+1;
    
    if(!shiftDown){
        anch.col=pos.col;
        anch.row=pos.row;
    }
}

function backspace(e){
    e.preventDefault();
    var slug=false;
    if (lines[pos.row][1]=='s')var slug=true;
	if(pos.row==anch.row && pos.col==anch.col){
        if(pos.col==0 && pos.row==0) return;
        if(pos.col==0){
            var j = lines[pos.row][0];
            lines.splice(pos.row,1);
            var newPos = lines[pos.row-1][0].length;
            lines[pos.row-1][0] = lines[pos.row-1][0]+j;
            pos.col=newPos;
            pos.row--;
        }
        else{
            lines[pos.row][0] = lines[pos.row][0].slice(0,pos.col-1)+lines[pos.row][0].slice(pos.col);
            pos.col--;
        }
        anch.col=pos.col;
        anch.row=pos.row;
    }
    // This is for deleting a range
    else{
        //put the focus after the anchor
        var switchPos =false;
        if(anch.row>pos.row)switchPos=true;
        if(anch.row==pos.row && anch.col>pos.col)switchPos=true;
        if(switchPos){
            var coor = anch.row;
            anch.row = pos.row;
            pos.row = coor;
            coor = anch.col;
            anch.col = pos.col;
            pos.col = coor;
        }
        while(pos.col!=anch.col || pos.row!=anch.row){
            if(lines[pos.row][1]=='s')slug=true;
            if(pos.col==0){
                var j = lines[pos.row][0];
                lines.splice(pos.row,1);
                var newPos = lines[pos.row-1][0].length;
                lines[pos.row-1][0] = lines[pos.row-1][0]+j;
                pos.col=newPos;
                pos.row--;
            }
            else{
                lines[pos.row][0] = lines[pos.row][0].slice(0,pos.col-1)+lines[pos.row][0].slice(pos.col);
                pos.col--;
            }
        }
    }
    if (slug)sceneIndex();
}
function deleteButton(){
    var slug=false;
    if(pos.row==anch.row&&pos.col==anch.col){
        if (lines[pos.row][1]=='s')var slug=true;
        if(pos.col==(lines[pos.row][0].length) && pos.row==lines.length-1) return;
        if(pos.col==(lines[pos.row][0].length)){
            if (lines[pos.row+1][1]=='s')slug=true;
            var j = lines[pos.row+1][0];
            lines.splice((pos.row+1),1);
            lines[pos.row][0]+=j;
        }
        else{
            lines[pos.row][0] = lines[pos.row][0].slice(0,pos.col)+lines[pos.row][0].slice(pos.col+1);
        }
    }
    // This is for deleting a range
    else{
        //put the focus after the anchor
        var switchPos =false;
        if(anch.row>pos.row)switchPos=true;
        if(anch.row==pos.row && anch.col>pos.col)switchPos=true;
        if(switchPos){
            var coor = anch.row;
            anch.row = pos.row;
            pos.row = coor;
            coor = anch.col;
            anch.col = pos.col;
            pos.col = coor;
        }
        while(pos.col!=anch.col || pos.row!=anch.row){
            if(lines[pos.row][1]=='s')slug=true;
            if(pos.col==0){
                var j = lines[pos.row][0];
                lines.splice(pos.row,1);
                var newPos = lines[pos.row-1][0].length;
                lines[pos.row-1][0] = lines[pos.row-1][0]+j;
                pos.col=newPos;
                pos.row--;
            }
            else{
                lines[pos.row][0] = lines[pos.row][0].slice(0,pos.col-1)+lines[pos.row][0].slice(pos.col);
                pos.col--;
            }
        }
    }
    if (slug)sceneIndex();
}
	
function enter(){
    if(lines[pos.row][1]=='c')characterIndex(lines[pos.row][0]);
        
	var j = lines[pos.row][0].slice(0,pos.col);
	var k = lines[pos.row][0].slice(pos.col);
	lines[pos.row][0] = j;
    if (lines[pos.row][1] == 's')var newElem = 'a';
    else if (lines[pos.row][1] == 'a')var newElem = 'c';
    else if (lines[pos.row][1] == 'c')var newElem = 'd';
    else if (lines[pos.row][1] == 'p')var newElem = 'd';
    else if (lines[pos.row][1] == 'd')var newElem = 'c';
    else if (lines[pos.row][1] == 't')var newElem = 's';
	var newArr = [k,newElem];
	lines.splice(pos.row+1,0,newArr);
	pos.row++;
	pos.col=0;
    anch.row=pos.row;
    anch.col=pos.col;
    console.log(lines[pos.row][0]);
    // This means it was a scene before
    // so run scene index
    //paint(false,false,true);
    if(lines[pos.row][1]=='a')sceneIndex();
}

function tab(){
    var slug=false;
    if (lines[pos.row][1]=='s')var slug=true;
	var type = lines[pos.row][1];
	if (type=='a'){
        lines[pos.row][1]='s';
        slug=true;
    }
	else if (type=='s')lines[pos.row][1]='c';
	else if (type=='c')lines[pos.row][1]='a';
	else if (type=='d')lines[pos.row][1]='p';
	else if (type=='p')lines[pos.row][1]='d';
	else if (type=='t'){
        lines[pos.row][1]='s';
        slug=true;
    }
    if(slug)sceneIndex();
}
	
function handlekeypress(event) {
	var d= new Date();
  	milli = d.getMilliseconds();
    if(pos.row!=anch.row || pos.col!=anch.col)deleteButton();
	if (event.which!=13){
		lines[pos.row][0] = lines[pos.row][0].slice(0,pos.col) + String.fromCharCode(event.charCode) +lines[pos.row][0].slice(pos.col);
  		pos.col++;
        if (lines[pos.row][1]=='s')sceneIndex();
  	}
    anch.col=pos.col;
    anch.row=pos.row;
}
function characterInit(){
    for(var i=0; i<lines.length;i++){
        if (lines[i][1]=='c'){
            characterIndex(lines[i][0]);
        }
    }
}
function characterIndex(v){
    var chara = v.toUpperCase();
    var found=false;
    for(var i=0;i<characters.length;i++){
        if(characters[i][0]==chara){
            characters[i][1]=characters[i][1]+1;
            found=true;
        }
    }
    if (!found){
        characters.push([chara,1]);
    }
}
function sceneIndex(){
    scenes=[];
    var num = 0;
    for (var i=0; i<lines.length; i++){
        if(lines[i][1]=='s'){
            num++;
            scenes.push(String(num)+') '+lines[i][0].toUpperCase());
        }
    }
}

//drawing functions
// like the scroll arrows
function scrollArrows(ctx){
    var height = document.getElementById('canvas').height;
    //up arrow
    ctx.fillStyle="#333";
    ctx.fillRect(editorWidth-22, height-39, 20,20);
    ctx.fillStyle='#ddd';
    ctx.fillRect(editorWidth-20, height-37, 16, 16);
    ctx.beginPath();
    ctx.moveTo(editorWidth-18, height-24);
    ctx.lineTo(editorWidth-12, height-35);
    ctx.lineTo(editorWidth-6, height-24);
    ctx.closePath();
    ctx.fillStyle="#333";
    ctx.fill();
    //down arrow
    ctx.fillStyle="#333";
    ctx.fillRect(editorWidth-22, height-19, 20,20);
    ctx.fillStyle='#ddd';
    ctx.fillRect(editorWidth-20, height-18, 16, 16);
    ctx.beginPath();
    ctx.moveTo(editorWidth-18, height-15);
    ctx.lineTo(editorWidth-12, height-4);
    ctx.lineTo(editorWidth-6, height-15);
    ctx.closePath();
    ctx.fillStyle="#333";
    ctx.fill();
}
function scrollBar(ctx, y){
    var height = document.getElementById('canvas').height;
    var barHeight = ((height-35)/y)*(height-35-39);
    if (barHeight<30)barHeight=30;
    if (barHeight>=height-35-39)barHeight=height-35-39;
    var topPixel = (vOffset/(y-height))*(height-35-39-barHeight)+35;
    ctx.fillRect(editorWidth-22, topPixel, 20,barHeight);
    
}
function paint(e, anchE, forceCalc){
    //console.log('pos.col='+pos.col+' pos.row='+pos.row);
    var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0,0, 2000,2500);
	ctx.fillStyle = background;
	//ctx.fillRect(0, 0, 800, 570);
    ctx.fillStyle = foreground;
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ddd';
    ctx.beginPath();
    ctx.moveTo(2,2);
    ctx.lineTo(2,document.getElementById('canvas').height-1);
    ctx.lineTo(editorWidth, document.getElementById('canvas').height-1);
    ctx.lineTo(editorWidth,2);
    ctx.stroke();
    
    ctx.font=font;
	var y = lineheight+50;
    //Stary Cycling through lines
	for (var i=0; i<lines.length; i++){
        //Don't render things way outside the screen
        if(!forceCalc && (y-vOffset>1200||y-vOffset<0)){
            y+=(lineheight*linesNLB[i]);
        }
        else{
            var type = lines[i][1];
            //Cursor position
            var anchOrFocus = (anchE ? anch.row : pos.row);
            if (i==pos.row){
                var cursorY = y-lineheight;
                if (type == 'a')var cursorX =WrapVariableArray[1][1];
                else if (type == 's')var cursorX =WrapVariableArray[0][1];
                else if (type == 'd')var cursorX =WrapVariableArray[3][1];
                else if (type == 'c')var cursorX =WrapVariableArray[2][1];
                else if (type == 'p')var cursorX =WrapVariableArray[4][1];
                else if (type == 't')var cursorX =WrapVariableArray[5][1];
                var thisRow = true;
                var wrappedText = [];
            }
            if (i==anch.row){
                var anchorY = y-lineheight;
                var anchorThisRow = true;
                var anchorWrappedText = []
            }
            
            var lineContent = lines[i][0];
            
            // Use the same wrapping procedure over and over
            // just define an array to pass into it
            //wrapVars[0]=character length before wrap
            //wrapVars[1]= distace from edge it should be placed ay
            //wrapVars[2]= bool, align right
            //wrapVars[3]= bool, uppercase
            //wrapVars[4]=number of line breaks after
            if (type=='s'){
                var wrapVars=WrapVariableArray[0];
                // use this opportunity to put int he grey backing
                var greyHeight = (Math.round((lineContent.length/61)+.5))*16;
                ctx.fillStyle='#ddd';
                ctx.fillRect(wrapVars[1]-3,(y-12-vOffset),605, greyHeight);
                ctx.fillStyle=foreground;
            }
            else if(type=='a') var wrapVars = WrapVariableArray[1];
            else if(type=='c') var wrapVars = WrapVariableArray[2];
            else if(type=='d') var wrapVars =  WrapVariableArray[3];
            else if(type=='p') var wrapVars = WrapVariableArray[4];
            else if(type=='t') var wrapVars = WrapVariableArray[5];
            
            var wordsArr = lineContent.split(' ');
            var word = 0;
            if(e||anchE)var wrapCounterOnClick=[];
            linesNLB[i]=0;
            while(word<wordsArr.length){
                var itr=0;
                if (wordsArr.slice(word).join().length<wrapVars[0]){
                    var printString = wordsArr.slice(word).join(' ');
                    if (wrapVars[3]==1)printString= printString.toUpperCase();
                    if (wrapVars[2]==1)ctx.textAlign='right';
                    if(printString!='')ctx.fillText(printString, wrapVars[1] , y-vOffset);
                    ctx.textAlign='left';
                    word=wordsArr.length;
                    for(var lbCounter=0; lbCounter<wrapVars[4]; lbCounter++){
                        linesNLB[i]=linesNLB[i]+1;
                        y+=lineheight;
                    }
                    if(e||anchE)wrapCounterOnClick.push(printString.length);
                    if(thisRow)wrappedText.push(printString.length);
                    if(anchorThisRow)anchorWrappedText.push(printString.length);
                }
                else{
                    var itr=0;
                    while(wordsArr.slice(word, word+itr).join(' ').length<wrapVars[0]){
                        newLineToPrint=wordsArr.slice(word, word+itr).join(' ');
                        itr++;
                        if (wrapVars[3]==1)newLineToPrint= newLineToPrint.toUpperCase();
                    }
                    ctx.fillText(newLineToPrint, wrapVars[1], y-vOffset);
                    linesNLB[i]=linesNLB[i]+1;
                    y+=lineheight;
                    word+=itr-1;
                    itr =0;
                    var lbCounter=1;
                    if(e||anchE)wrapCounterOnClick.push(newLineToPrint.length);
                    if (thisRow)wrappedText.push(newLineToPrint.length);
                    if(anchorThisRow)anchorWrappedText.push(newLineToPrint.length);
                }
                // changing cursor position
                // on click
                // Bad place to put it. See if can be done
                // better in mouseClick function
                if(e && e.clientY+vOffset>(y-6-18*lbCounter) && e.clientY+vOffset<(y+19-18*lbCounter)){
                    pos.row=i;
                    pos.col=0;
                    for(var integ=0; integ<wrapCounterOnClick.length-1; integ++){
                        pos.col+=wrapCounterOnClick[integ]+1;
                    }
                    if(type!='t')pos.col+=Math.round(((e.clientX-wrapVars[1])/fontWidth));
                    else{
                        pos.col-=Math.round(((wrapVars[1]-e.clientX)/fontWidth));
                        pos.col+=lines[i][0].length;
                    }
                    var onClickLengthLimit=0;
                    for(var integ=0; integ<wrapCounterOnClick.length; integ++){
                        onClickLengthLimit+=wrapCounterOnClick[integ]+1;
                    }
                    if(pos.col>onClickLengthLimit)pos.col=onClickLengthLimit-1;
                    if(pos.col<0)pos.col=0;
                    
                }
                // Now setting anchor position
                if(anchE && anchE.clientY+vOffset>(y-6-18*lbCounter) && anchE.clientY+vOffset<(y+19-18*lbCounter)){
                    anch.row=i;
                    anch.col=0;
                    for(var integ=0; integ<wrapCounterOnClick.length-1; integ++){
                        anch.col+=wrapCounterOnClick[integ]+1;
                    }
                    if(type!='t')anch.col+=Math.round(((anchE.clientX-wrapVars[1])/fontWidth));
                    else{
                        anch.col-=Math.round(((wrapVars[1]-anchE.clientX)/fontWidth));
                        anch.col+=lines[i][0].length;
                    }
                    var onClickLengthLimit=0;
                    for(var integ=0; integ<wrapCounterOnClick.length; integ++){
                        onClickLengthLimit+=wrapCounterOnClick[integ]+1;
                    }
                    if(anch.col>onClickLengthLimit)anch.col=onClickLengthLimit-1;
                    if(anch.col<0)anch.col=0;
                    
                }
                
            }
            var thisRow=false;
            var anchorThisRow=false;
        }
	  }
      // End Looping through lines
	  
	  // Cursor
	  var d= new Date();
	  var newMilli = d.getMilliseconds();
	  var diff = newMilli-milli;
	  var cursor = false;
	  if (diff>0 && diff<500){
		  cursor = true;
	  }
	  if (diff<0 && diff<-500){
		  cursor = true;
	  }
	  if(cursor&&wrappedText){
          var wrapCounter=0;
          var lrPosDiff = pos.col;
          var totalCharacters=wrappedText[wrapCounter];
          while (pos.col>totalCharacters){
                wrapCounter++;
                totalCharacters+=1+wrappedText[wrapCounter];
          }
          totalCharacters-=wrappedText[wrapCounter];
		  var lr = cursorX+((pos.col-totalCharacters)*fontWidth);
          if(lines[pos.row][1]=='t')lr -= lines[pos.row][0].length*fontWidth;
		  var ud = 2+cursorY+(wrapCounter*lineheight)-vOffset;
		  ctx.fillRect(lr,ud,1,20);
	  }
      
      if(anch.row!=pos.row || anch.col!=pos.col){
          if(anchorWrappedText){
              var wrapCounter=0;
              var lrPosDiff = anch.col;
              var totalCharacters=anchorWrappedText[wrapCounter];
              while (anch.col>totalCharacters){
                    wrapCounter++;
                    totalCharacters+=1+anchorWrappedText[wrapCounter];
              }
              totalCharacters-=anchorWrappedText[wrapCounter];
              //console.log(totalCharacters);
              var type=lines[anch.row][1];
              if(type=='s')anchorX=WrapVariableArray[0][1];
              else if(type=='a')anchorX=WrapVariableArray[1][1];
              else if(type=='c')anchorX=WrapVariableArray[2][1];
              else if(type=='d')anchorX=WrapVariableArray[3][1];
              else if(type=='p')anchorX=WrapVariableArray[4][1];
              else if(type=='t')anchorX=WrapVariableArray[5][1];
              var lr = anchorX+((anch.col-totalCharacters)*fontWidth);
              if(lines[anch.row][1]=='t')lr -= lines[anch.row][0].length*fontWidth;
              var ud = 2+anchorY+(wrapCounter*lineheight)-vOffset;
              ctx.fillStyle='red'
              ctx.fillRect(lr,ud,1,20);
              ctx.fillStyle=foreground;
          }
      }
      
      
      
      //Make the scene list
      var sceneY=50;
      for(var i=0; i<scenes.length; i++){
        ctx.fillText(scenes[i], editorWidth+20,sceneY);
        sceneY+=lineheight;
      }
          //Start work on frame and buttons and stuff
    ctx.fillStyle = '#6484df';
    ctx.fillRect(0,0,document.getElementById('canvas').width,35);
    //make button for selecting format
    ctx.fillStyle = '#efefef';
    ctx.fillRect(10,7,110,20);
    ctx.fillStyle= foreground;
    ctx.font = '12pt Arial';
    var f = lines[pos.row][1];
    if (f=='s')var format = 'Slugline';
    else if(f=='a')var format = 'Action';
    else if(f=='c')var format = 'Character';
    else if(f=='d')var format = 'Dialog';
    else if(f=='p')var format = 'Parenthetical';
    else if(f=='t')var format = 'Transition';
    ctx.fillText(format, 15, 23);
	ctx.font = font;
	ctx.fillStyle = foreground;
    //Make Print Button
    ctx.fillRect(200,7,110,20);
    // Format Menu
      // Drop down type then when Format button is clicked on
      if (formatMenu){
        ctx.fillStyle = '#efefef';
        ctx.fillRect(10,7,110,120);
        ctx.fillStyle= foreground;
        ctx.font = '12pt Arial';
        formatMenuY=23;
        for (var i=0; i<formats.length; i++){
            ctx.fillText(formats[i], 15, formatMenuY);
            formatMenuY+=19;
        }
      }
      //Make ScrollBar
      scrollArrows(ctx);
      scrollBar(ctx, y);
	}