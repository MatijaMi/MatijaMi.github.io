/*	Function that depending on the Horizontal and Vertical Sampling factor 
	chooses the proper function for further decoding of the bytes
	HSV=1 VSF=1 => RGGB (RAW)
	HSV=2 VSF=1 => YYCbCr (sRaw)
	HSV=2 VSF=2 => YYYYCbCr(mRaw)
*/
function decodeImage(rgb){
	var hsf=metaData.get("SOF3").get("HSF");
	var vsf=metaData.get("SOF3").get("VSF");
	/*	
	Due to JavaScript being limited to one thread workers are used for
	the heavier computations so that the website doesn't freeze up
	*/	
	var w = new Worker('Scripts/Workers/Decode_Worker.js');
	if(hsf==1){
		var mode ="rggb";
	}else{
		if(vsf=1){
			var mode="yycc";
		}else{
			var mode="yyyycc"
		}
	}
	//Slight adjustment to the UI
	document.getElementById("decodeR").style="display:none";
	document.getElementById("progressBar").style="display:block";
	document.getElementById("bar").style="width:0.1%";
	document.getElementById("bar").innerHTML="0.0%"
	disableButtons(true);
	document.getElementById("pbText").innerHTML="Transforming bytes";
	
	//Starting work with the worker
	w.postMessage([bytes,metaData,rgb,mode]);
	
	w.onmessage=function(e){
		/*
		RES means the computation is done and the result is ready so
		the UI needs to be adapted again
		*/
		if(e.data[0]=="RES"){
			document.getElementById("pbText").innerHTML="";
			document.getElementById("loading").style="display:none"
			console.log(e.data[2]);
			document.getElementById(e.data[2]).style="display:";
			disableButtons(false);
				
			downloadBytes= e.data[1];
			w.terminate();//Worker is terminated after it isn't needed anymore
		}else{
			/*PB used for updating the Progress Bar*/
			if(e.data[0]=="PB"){
			document.getElementById("pbText").innerHTML="<b>"+e.data[2]+"</b>";
			document.getElementById("bar").style.width=e.data[1]+"%";
			document.getElementById("bar").innerHTML=e.data[1]+"%";
			}else{
				/*
				Due to the transformation into a blob being a built-in JS function
				using a progress bar is not possible, therefore a loading gif is used
				*/
				document.getElementById("pbText").innerHTML="<b> Preparing Download </b>";
				document.getElementById("loading").style="display:"
				document.getElementById("progressBar").style="display:none";
			}
		}
	}
	
}

//Function that disables the other buttons while the decoding going on
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


