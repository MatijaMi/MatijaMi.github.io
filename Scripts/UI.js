/*	Function that disables the other buttons during decoding */
function disableButtons(mode){
	var elems = document.getElementsByClassName("downloadButton");
	var color,cursor,textCol;
	if(mode){
		color="gray";
		cursor="default";
		textCol="lightgray";
	}else{
		color="black";
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

/* Starts the UI(progress bar) used to visualise decoding progress */
function initialiseDecodeUI(){
	document.getElementById("progressBar").style="display:block";
	document.getElementById("bar").style="width:0.1%";
	document.getElementById("bar").innerHTML="0.0%"
	disableButtons(true);
	document.getElementById("pbText").innerHTML="Transforming bytes";
}
/*Shows the UI for a completed decode */
function showDecodeEndUI(mode,rgb){
		if(rgb){
			document.getElementById("decodeRGB").style="display:none";
		}else{
			document.getElementById("decodeFormat").style="display:none";
		}
		document.getElementById("pbText").innerHTML="";
		document.getElementById("loading").style="display:none"
		document.getElementById(mode).style="display:";
		disableButtons(false);
}
/*Updating the progress bar with appropriate text and width */
function updateProgressBar(progress, text){
		document.getElementById("pbText").innerHTML="<b>"+text+"</b>";
		document.getElementById("bar").style.width=Math.min(progress,100)+"%";
		document.getElementById("bar").innerHTML=Math.min(progress,100)+"%";
}

/*	Due to the transformation into a blob being a built-in JS function
	using a progress bar is not possible, therefore a loading gif is used*/
function startLoadingAnimation(){
		document.getElementById("pbText").innerHTML="<b> Preparing Download </b>";
		document.getElementById("loading").style="display:"
		document.getElementById("progressBar").style="display:none";
}

function setImage(data){
	var blob = new Blob([data], {type: 'image/jpeg'});
	// Use createObjectURL to make a URL for the blob
	var image = new Image();
	image.src = URL.createObjectURL(blob);
	image.style.width="75%";
	image.style.border="1px solid black"
	document.getElementById("image").innerHTML="";
	document.getElementById("image").appendChild(image);
}

/* Showing the most user relevant parts of the meta data to the user */
function initialiseSiteUI(){
			
		var sof3=metaData.get("SOF3");
		var output =[];
		output.push("<p><b>Camera Model: </b>" + metaData.get("ModelName"));
		output.push("<p><b>Length of Raw: </b>" + metaData.get("RawLength") +" Bytes");
		output.push("<p><b>Slices:</b> " + metaData.get("Slices"));
		output.push("<p><b>Sample Precision: </b>" + sof3.get("SamplePrecision"));
		output.push("<p><b>Image Components: </b>" + sof3.get("ImageComponents"));
		output.push("<p><b>Number of Lines: </b>" + sof3.get("NumberOfLines"));
		output.push("<p><b>Samples per Line: </b>" + sof3.get("SamplesPerLine"));
		output.push("<p><b>Horizontal Sampling Factor: </b>" + sof3.get("HSF"));
		output.push("<p><b>Vertical Sampling Factor: </b>" + sof3.get("VSF"));
		
		document.getElementById("inputBox").style="padding-top:15px; padding-bottom:5px";
		document.getElementById("dropzone").style="margin-bottom:40px";
		//Showing needed elements
		document.getElementById("label").innerHTML="Upload a different file";
		document.getElementById("left").style="display:block";
		document.getElementById("right").style="display:block";
		document.getElementById("info").style="text-align:left";
		document.getElementById("info").innerHTML= '<ul>' + output.join('') + '</ul>';
		document.getElementById("decodeFormat").style="display:";
		document.getElementById("decodeRGB").style="display:";

		//Hiding buttons that aren't needed
		document.getElementById("loading").style="display:none"
		document.getElementById("dyycc").style="display:none";
		document.getElementById("dyyyycc").style="display:none";
		document.getElementById("drggb").style="display:none";
		document.getElementById("drgb").style="display:none";
		document.getElementById("progressBar").style="display:none";
		document.getElementById("pbText").innerHTML="";
		//Shows the jpeg image as a thumbnail
		setImage(jpeqBytes);
		switch(sof3.get("HSF")+sof3.get("VSF")){
			case 3:
				var format= "YYCbCr";
				break;
			case 4:
				var format= "YYYYCbCr";
				break;
			default:
				var format= "RGGB";
		}
		//Show fitting button
		document.getElementById("decodeFormat").innerHTML = "Decode as " +format;
		disableButtons(false);
	
		/*	Starting up the worker needed for later and 
			stopping an old one if it is still running */
		if(typeof w !== "undefined"){
			w.terminate();
		}
		window.w = new Worker('Scripts/Workers/decode_Worker.js');
		window.downloadBytes=[];//Initialise an array to save bytes to be downloaded	
}
