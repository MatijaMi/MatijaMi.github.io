self.importScripts('../Decode/decompress.js','../Decode/decodeUtils.js','../Decode/unslicing.js');
self.importScripts('../Util/byteTransformations.js','../Decode/interpolations.js','../Decode/colorConversion.js','../Decode/postProcessing.js','../Util/matrixFunctions.js');

onmessage=function(e){
	var bitTime = new Date();
	var metaData = e.data[1];
	var colorFormat =e.data[2];//Either rggb, yycc or yyyycc
	var decodeMode = e.data[3];
	var cropMode = e.data[4];
	var brightnessMode = e.data[5];
	//The values need to be decompressed first
	var image =decompressValues(transformBytesToBits(e.data[0]),metaData);
	//Applying the correct unslicing and post processing functions on the image
	if(metaData.get("Slices")[0]!=0){
		switch(colorFormat){
			case "drggb":
				image = unsliceRGGB(image,metaData);
				if(isGRBG(image)){
					image.shift();//Remove first line
				}
				break;
			case "dyycc":
				image = unsliceYCbCr(image,metaData);
				image = interpolateYCC(image);
				image = convertToRGB(image,"YYCC");
				break;
			case "dyyyycc":
				image = unsliceYYYYCbCr(image,metaData);
				image = interpolateYYYYCbCr(image);
				image = convertToRGB(image,"YYYYCC");
				break;
		}
	}
	if(decodeMode>0){
		image=normalizeImage(image,metaData);
	}
	if(decodeMode>1){
		image=applyWhiteBalance(image,metaData);
	}	
	if(decodeMode>2 && colorFormat.includes("drggb")){
		image=bayerInterpolation(image);
	}
	if(cropMode){
		image=cropImage(image,metaData);
	}
	if(decodeMode>3){
		image=convertTosRGB(image,metaData);
		if(brightnessMode){
			image=brightenImage(image);
		}
		image=correctGamma(image);
	}
	postMessage(["DL"]);
	var blob = new Blob( [JSON.stringify(image)], {type: "octet/stream"});
	postMessage(["RES",blob]);
	
	var end = new Date();
	console.log("TOTAL TIME: " + (end.getTime()-bitTime.getTime()));
	
	self.close();
}