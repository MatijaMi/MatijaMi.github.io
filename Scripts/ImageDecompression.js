//Functions for decompressing the raw image coming


function decompress(metaData){
	
	var image;
	var HSF = metaData.get("SOF3").get("HSF");
	var VSF = metaData.get("SOF3").get("VSF");
	
	if(HSF==1){
		image = decompressRGGB(metaData);
	}else{
		if(VSF==1){
			image = decompressYCC(metaData);
		}else{
			image = decompressYYYYCC(metaData);
		}
	}
	return image;
}

