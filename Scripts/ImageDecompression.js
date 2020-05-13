//Functions for decompressing the raw image coming


function decompress(metaData){
	
	var image;
	var HSF = metaData.get("SOF3").get("HSF");
	var VSF = metaData.get("SOF3").get("VSF");
	
	if(HSF==1){
		image = decompressRGGB(metaData);
	}else{
		if(VSF==1){
			console.log("Decompressing YCC");
			image = decompressYCC(metaData);
			//image = applyDiffs(image);
			console.log("Interpolating YCC");
			image = interpolateYCC(image);
			console.log("YCC->RGB");
			image = YCCtoRGB(image);
		}else{
			image = decompressYYYYCC(metaData);
		}
	}
	return image;
}

