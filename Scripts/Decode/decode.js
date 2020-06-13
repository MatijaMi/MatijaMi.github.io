function decodeImage(rgb){
	/*	HSV=1 VSF=1 => RGGB (normal RAW)(2)
		HSV=2 VSF=1 => YYCbCr (sRaw)(3)
		HSV=2 VSF=2 => YYYYCbCr(mRaw)(4) */
	
	var hsf=metaData.get("SOF3").get("HSF");
	var vsf=metaData.get("SOF3").get("VSF");
	
	switch(hsf+vsf){
		case 3:
			var mode ="yycc";
			break;
		case 4:
			var mode="yyyycc";
			break;
		default:
			var mode ="rggb";
	}
	initialiseDecodeUI();
	/*	Due to JavaScript being limited to one thread workers are used for
		the heavier computations so that the website doesn't freeze up
		Worker is already initialised with the site to allow termination at any point */	
	w.postMessage([bytes,metaData,rgb,mode]);
	
	w.onmessage=function(e){
		switch(e.data[0]){
			case "RES"://RES = Result
				showDecodeEndUI(e.data[2],e.data[3]);
				downloadBytes= e.data[1];
				break;
			case "PB"://PB = Progress Bar
				updateProgressBar(e.data[1],e.data[2]);
				break;
			case "DL"://Preparing the file can take a bit
				startLoadingAnimation();
				break;	
		}	
	}
}
