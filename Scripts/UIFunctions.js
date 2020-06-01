/*	Function that disables the other buttons during decoding */
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

/* Starts the UI(progress bar) used to visualise decoding progress */
function initialiseDecodeUI(){
	document.getElementById("decodeR").style="display:none";
	document.getElementById("progressBar").style="display:block";
	document.getElementById("bar").style="width:0.1%";
	document.getElementById("bar").innerHTML="0.0%"
	disableButtons(true);
	document.getElementById("pbText").innerHTML="Transforming bytes";
}
/*Shows the UI for a completed decode */
function showDecodeEndUI(mode){
		document.getElementById("pbText").innerHTML="";
		document.getElementById("loading").style="display:none"
		document.getElementById(mode).style="display:";
		disableButtons(false);
}
/*Updating the progress bar with appropriate text and width */
function updateProgressBar(progress, text){
		document.getElementById("pbText").innerHTML="<b>"+text+"</b>";
		document.getElementById("bar").style.width=progress+"%";
		document.getElementById("bar").innerHTML=progress+"%";
}

/*	Due to the transformation into a blob being a built-in JS function
	using a progress bar is not possible, therefore a loading gif is used*/
function startLoadingAnimation(){
		document.getElementById("pbText").innerHTML="<b> Preparing Download </b>";
		document.getElementById("loading").style="display:"
		document.getElementById("progressBar").style="display:none";
}

function setImage(data, x,y){
	var blob = new Blob([data], {type: 'image/jpeg'});
	// Use createObjectURL to make a URL for the blob
	var image = new Image();
	image.src = URL.createObjectURL(blob);
	image.style.width="75%";
	image.style.border="1px solid black"
	document.getElementById("image").innerHTML="";
	document.getElementById("image").appendChild(image);
}
