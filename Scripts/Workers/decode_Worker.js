self.importScripts('../Decode/decompress.js','../Decode/decodeUtils.js','../Decode/unslicing.js');
self.importScripts('../byteTransformations.js','../Decode/interpolations.js','../Decode/colorConversion.js','../Decode/postProcessing.js');

onmessage=function(e){
	var bitTime = new Date();
	var metaData = e.data[1];
	var colorFormat =e.data[2];//Either rggb, yycc or yyyycc
	var interpolationMode=e.data[3];
	var cropMode=e.data[4];
	var colorBalance=e.data[5];
	var blackLevelMode=e.data[6];
	var colorMode=e.data[7];
	//The values need to be decompressed first
	var image =decompressValues(transformBytesToBits(e.data[0]),metaData);
	//Applying the correct unslicing and post processing functions on the image
	switch(colorFormat){
		case "drggb":		
			if(metaData.get("Slices")[0]>0){//0 means there is only one slice,therefore no unslicing is needed
				image = unsliceRGGB(image,metaData);
			}
			if(interpolationMode){
				image=bayerInterpolation(image);//TO Do Implement other interpolation
			}else{
				image=bayerInterpolation(image);
			}
			break;
			
		case "dyycc":
			if(metaData.get("Slices")[0]>0){
				image = unsliceYCbCr(image,metaData);
			}
			image=convertToRGB(interpolateYCC(image, metaData),"YYCC");
			break;
		
		case "dyyyycc":
			if(metaData.get("Slices")[0]>0){
				image = unsliceYYYYCbCr(image,metaData);
			}
			image=convertToRGB(interpolateYYYYCbCr(image,metaData),"YYYYCC");
			break;	
	}
	if(cropMode){
		image=cropImage(image,metaData,colorFormat);
	}
	if(colorBalance){
		image=applyColorBalance(image,metaData);
	}
	if(blackLevelMode){
		image=adjustBlackLevels(image,metaData);
	}
	if(colorMode){
		image= convertTo24Bit(image);
	}
	postMessage(["DL"]);
	var blob = new Blob( [JSON.stringify(image)], {type: "octet/stream"});
	postMessage(["RES",blob]);
	
	var end = new Date();
	console.log("TOTAL TIME: " + (end.getTime()-bitTime.getTime()));
	
	self.close();
}