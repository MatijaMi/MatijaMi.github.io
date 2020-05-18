function decodeYCC(mode){
	document.getElementById("decodeY").style="display:none";
	//document.getElementById("progressBar").style="display:block";
	//var w = new Worker('Scripts/YCC_Worker.js');
	var data = bytes.slice(metaData.get("RawBitOffset"));
	//decodeYTEST(data);
	console.log(metaData.get("RawBitOffset"));
	var temp=decompressYCC(data);
	console.log("Interpol");
	temp= interpolateYCC(temp);
	console.log("YCC->RGB");
	temp=YCCtoRGB(temp);
	downloadBytes=[temp];
	console.log(downloadBytes.length);
}