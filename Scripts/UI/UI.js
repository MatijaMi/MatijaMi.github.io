/*	Function that disables the other buttons during decoding 
	True=On False=Off	*/
function changeButtonState(state){//TO DO Disable checkboxes
	let elems = document.getElementsByClassName("mainButtons");
	let color,cursor,textCol;
	if(state){
		color="black";
		cursor="pointer";
		textCol="white";
	}else{
		color="gray";
		cursor="default";
		textCol="lightgray";
	}
	for(let i =0; i <elems.length;i++){
		elems[i].disabled=!state;
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
	document.getElementById("pbText").innerHTML="Transforming bytes";
	document.getElementById("pure").disabled=true;
	document.getElementById("whiteBal").disabled=true;
	document.getElementById("full").disabled=true;
	changeButtonState(false);
}
/*Shows the UI for a completed decode */
function showDecodeEndUI(){
		document.getElementById("decodeRGB").style="display:none";
		document.getElementById("pbText").innerHTML="";
		document.getElementById("loading").style="display:none"
		document.getElementById("drgb").style="display:";
		document.getElementById("pure").disabled=false;
		document.getElementById("whiteBal").disabled=false;
		document.getElementById("full").disabled=false;
		changeButtonState(true);
}
/*Updating the progress bar with appropriate text and width */
function updateProgressBar(progress,percent, text){
		progress=progress/percent;
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

/* Showing the most user relevant parts of the meta data to the user */
function initialiseSiteUI(){
		//TO DO ADD ACTUALLY USER RELEVANT DATA,AFTER EVERYTHING IS WORKING
		var output =[];
		var sof3=metaData.get("SOF3");
		var slices=metaData.get("Slices");
	
		var canonFormat;
		switch(sof3.get("HSF")*sof3.get("VSF")){
			case 1:
				canonFormat="RAW";
				var width = (slices[0]*slices[1]+slices[2]);
				break;
			case 2:
				canonFormat="sRAW";
				var width = (slices[0]*slices[1]+slices[2])/2;
				break;
			case 4:
				canonFormat="mRAW";
				var width = (slices[0]*slices[1]+slices[2])/3;
				break;
		}
	
		output.push("<p><b>Camera Model: </b><br>" + metaData.get("ModelName"));
		output.push("<p><b>Size of Raw: </b><br>" + (metaData.get("RawLength")/(1024*1024)).toFixed(2) +" MB");
		output.push("<p><b>Dimensions: </b><br>" +width+"x"+sof3.get("NumberOfLines"));
		output.push("<p><b>Format: </b><br>" + canonFormat);
		output.push("<p><b>Sample Precision: </b><br>" + sof3.get("SamplePrecision")+" Bits");
	
		document.getElementById("inputBox").style="padding-top:15px; padding-bottom:5px";
		document.getElementById("dropzone").style="margin-bottom:40px";
		//Showing needed elements
		document.getElementById("label").innerHTML="Upload a different file";
		document.getElementById("left").style="display:block";
		document.getElementById("mid").style="display:block";
		document.getElementById("right").style="display:block";
		document.getElementById("info").style="text-align:left";
		document.getElementById("info").innerHTML= '<ul>' + output.join('') + '</ul>';
		document.getElementById("decodeRGB").style="display:";

		//Hiding buttons that aren't needed
		document.getElementById("loading").style="display:none"
		document.getElementById("drgb").style="display:none";
		document.getElementById("progressBar").style="display:none";
		document.getElementById("pbText").innerHTML="";
		//Shows the jpeg image as a thumbnail
		setImage(jpeqBytes);
		changeButtonState(true);
		//Reset radio buttons
		document.getElementById("pure").disabled=false;
		document.getElementById("whiteBal").disabled=false;
		document.getElementById("full").disabled=false;
	
		/*	Starting up the worker needed for later and 
			stopping an old one if it is still running */
		if(typeof w !== "undefined"){
			w.terminate();
		}
		w = new Worker('Scripts/Workers/decode_Worker.js');
		let elems = document.getElementsByClassName("checkBox");
		for(let i =0; i <elems.length;i++){
			elems[i].checked=false;
		}
}

function setImage(data){
	var blob = new Blob([data], {type: 'image/jpeg'});
	// Use createObjectURL to make a URL for the blob
	var image = new Image();
	image.src = URL.createObjectURL(blob);
	image.style.width="90%";
	image.style.border="1px solid black"
	document.getElementById("image").innerHTML="";
	document.getElementById("image").appendChild(image);
}

