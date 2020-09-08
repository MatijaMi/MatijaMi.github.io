/*	HSV=1 VSF=1 => RGGB (normal RAW)(2)
	HSV=2 VSF=1 => YYCbCr (sRaw)(3)
	HSV=2 VSF=2 => YYYYCbCr(mRaw)(4) */

function decodeImage(rgb){
	initialiseDecodeUI();
	var decodeMode = getDecodeMode();
	switch(metaData.get("SOF3").get("HSF") + metaData.get("SOF3").get("VSF")){
		case 3:
			var colorFormat ="dyycc";
			break;
		case 4:
			var colorFormat="dyyyycc";
			break;
		default:
			var colorFormat ="drggb";
	}
	
	/*	Due to JavaScript being limited to one thread workers are used for
		the heavier computations so that the website doesn't freeze up
		Worker is already initialised with the site to allow termination at any point */	
	w.postMessage([bytes,metaData,colorFormat,decodeMode,cropMode]);
	
	//React to messages from worker
	w.onmessage=function(e){
		switch(e.data[0]){
			case "RES"://RES = Result
				showDecodeEndUI();
				downloadBytes= e.data[1];
				break;
			case "PB"://PB = Progress Bar
				updateProgressBar(e.data[1],e.data[2],e.data[3]);
				break;
			case "DL"://Preparing the file can take a bit
				startLoadingAnimation();
				break;	
		}	
	}
}