function decodeYCC(rgbOn){
	document.getElementById("decodeY").style="display:none";
	document.getElementById("progressBar").style="display:block";
	var w = new Worker('Scripts/YCC_Worker.js');
	var data = bytes.slice(metaData.get("RawBitOffset"));
	w.postMessage([data,metaData,rgbOn]);
	
	w.onmessage=function(e){
		if(e.data[0]=="RES"){
			document.getElementById("progressBar").style="display:none";
			if(rgbOn){
				document.getElementById("drgb").style="display:block";
			}else{
				document.getElementById("dycc").style="display:block";
			}
			downloadBytes=[e.data[1]];
			w.terminate();
		}else{
			document.getElementById("bar").style.width=e.data[0]+"%";
			document.getElementById("bar").innerHTML=e.data[0]+"%";
		}
	}
}