function decodeRGB(){
	var hsf=metaData.get("SOF3").get("HSF");
	var vsf=metaData.get("SOF3").get("VSF");
	if(hsf==1){
		decodeRGGB(true);
	}else{
		if(vsf==1){
			decodeYCC(true);
		}else{	
		decodeYYYYCC(true);
		}
	}
}


function decodeRGGB(rgbOn){
	document.getElementById("decodeR").style="display:none";
	document.getElementById("progressBar").style="display:block";
	document.getElementById("bar").style="width:0.1%";
	document.getElementById("bar").innerHTML="0.0%"

	disableButtons(true);
		
	var w = new Worker('Scripts/Workers/RGGB_Worker.js')
	document.getElementById("pbText").innerHTML="Transforming bytes";
	w.postMessage([bytes,metaData,rgbOn]);
	
	w.onmessage=function(e){
		if(e.data[0]=="RES"){
			document.getElementById("pbText").innerHTML="";
			document.getElementById("loading").style="display:none"
			
			if(rgbOn){
				document.getElementById("drgb").style="display:";
			}else{
				document.getElementById("drggb").style="display:";
			}
			var x = e.data[1];
			downloadBytes=x;
			disableButtons(false);
			w.terminate();
		}else{
			if(e.data[0]=="PB"){
			document.getElementById("pbText").innerHTML="<b>"+e.data[2]+"</b>";
			document.getElementById("bar").style.width=e.data[1]+"%";
			document.getElementById("bar").innerHTML=e.data[1]+"%";
			}else{
				document.getElementById("pbText").innerHTML="<b> Preparing Download </b>";
				document.getElementById("loading").style="display:"
				document.getElementById("progressBar").style="display:none";
			}
		}
	}
}


function decodeYCC(rgbOn){
	document.getElementById("decodeY").style="display:none";
	document.getElementById("progressBar").style="display:block";
	document.getElementById("bar").style="width:0.1%";
	document.getElementById("bar").innerHTML="0.0%"

	disableButtons(true);
		
	var w = new Worker('Scripts/Workers/YCC_Worker.js');
	w.postMessage([bytes,metaData,rgbOn]);
	
	w.onmessage=function(e){
		if(e.data[0]=="RES"){
			document.getElementById("progressBar").style="display:none";
			document.getElementById("loading").style="display:none"
			document.getElementById("pbText").innerHTML="";
			
			if(rgbOn){
				document.getElementById("drgb").style="display:";
			}else{
				document.getElementById("dycc").style="display:";
			}
			downloadBytes=e.data[1];
			disableButtons(false);
			w.terminate();
		}else{
			if(e.data[0]=="PB"){
			document.getElementById("pbText").innerHTML="<b>"+e.data[2]+"</b>";
			document.getElementById("bar").style.width=e.data[1]+"%";
			document.getElementById("bar").innerHTML=e.data[1]+"%";
			}else{
				document.getElementById("pbText").innerHTML="<b> Preparing Download </b>";
				document.getElementById("loading").style="display:"
				document.getElementById("progressBar").style="display:none";
			}
		}
	}
}

function decodeYYYYCC(rgbOn){
	document.getElementById("decodeYY").style="display:none";
	document.getElementById("progressBar").style="display:block";
	document.getElementById("bar").style="width:0.1%";
	document.getElementById("bar").innerHTML="0.0%"

	disableButtons(true);
		
	var w = new Worker('Scripts/Workers/YYYYCC_Worker.js');
	w.postMessage([bytes,metaData,rgbOn]);
	
	w.onmessage=function(e){
		if(e.data[0]=="RES"){
			document.getElementById("progressBar").style="display:none";
			document.getElementById("loading").style="display:none"
			document.getElementById("pbText").innerHTML="";
			
			if(rgbOn){
				document.getElementById("drgb").style="display:";
			}else{
				document.getElementById("dyycc").style="display:";
			}
			downloadBytes=e.data[1];
			disableButtons(false);
			w.terminate();
		}else{
			if(e.data[0]=="PB"){
			document.getElementById("pbText").innerHTML="<b>"+e.data[2]+"</b>";
			document.getElementById("bar").style.width=e.data[1]+"%";
			document.getElementById("bar").innerHTML=e.data[1]+"%";
			}else{
				document.getElementById("pbText").innerHTML="<b> Preparing Download </b>";
				document.getElementById("loading").style="display:"
				document.getElementById("progressBar").style="display:none";
			}
		}
	}
}







function disableButtons(mode){
	var elems = document.getElementsByClassName("downloadButton");
	var color,cursor,textCol;
	if(mode){
		color="gray";
		cursor="default";
		textCol="lightgray";
	}else{
		color="blue";
		cursor="pointer";
		textCol="white";
	}
	for(var i =0; i <elems.length;i++){
		
		elems[i].disabled=mode;
		elems[i].style.backgroundColor=color;
		elems[i].style.border="1px solid " +color;
		elems[i].style.cursor=cursor;
		elems[i].style.color=textCol;
	}
}	


