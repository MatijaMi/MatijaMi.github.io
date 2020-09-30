self.importScripts('../Decode/decompress.js','../Decode/decodeUtils.js','../Decode/unslicing.js');
self.importScripts('../Util/byteTransformations.js','../Decode/interpolations.js','../Decode/colorConversion.js','../Decode/postProcessing.js','../Util/matrixFunctions.js');

onmessage=function(e){
	var metaData = e.data[1]; //Collected metaData
	var colorFormat =e.data[2];//Either rggb, yycc or yyyycc
	var decodeMode = e.data[3];// How much processing is wanted
	var cropMode = e.data[4];//To be cropped of not
	//The values need to be decompressed first
	var image =decompressValues(transformBytesToBits(e.data[0]),metaData);
	var isCFA;
	//Applying the correct unslicing and post processing functions on the image
	if(metaData.get("Slices")[0]!=0){
		switch(colorFormat){
			case "drggb":
				isCFA=true;
				image = unsliceRGGB(image,metaData);
				if(isGRBG(image)){
					image.shift();//Remove first line if it's a GRBG CFA, in order toget an RGGB CFA
				}
				break;
			case "dyycc":
				isCFA=false;
				image = interpolateYCC(unsliceYCbCr(image,metaData));//Interpolation
				image = convertToRGB(image,"YYCC");//Conversion to RGB
				break;
			case "dyyyycc":
				isCFA=false;
				image = interpolateYYYYCbCr(unsliceYYYYCbCr(image,metaData));//Interpolation
				image = convertToRGB(image,"YYYYCC");//Conversion to RGB
				break;
		}
	}
	
	if(cropMode){//Crop
		image=cropImage(image,metaData);
	}
	
	if(decodeMode==0){
		if(isCFA){
			image.unshift([-1]);
		}else{
			image.unshift([-3]);
		}	
	}
	
	if(decodeMode>0){//Normalized Color
		image=normalizeImage(image,metaData);
		if(decodeMode==1 && isCFA){
			image.unshift([-2]);
		}
	}
	
	if(decodeMode>1){//White-Balancing
		image=applyWhiteBalance(image,metaData);
		if(decodeMode==2 && isCFA){
			image.unshift([-2]);
		}
	}
	
	if(decodeMode>2 && colorFormat.includes("drggb")){//Demosaicing
		image=bayerInterpolation(image);
	}
	
	if(decodeMode>3){//Color Conversion
		image=convertTosRGB(image,metaData);
	}
	
	if(decodeMode>4){//Brightness and Gamma correction
		image=brightenImage(image);
		image=correctGamma(image);
	}
	
	postMessage(["DL"]);
	//Transform data to JSON File
	var blob = new Blob( [JSON.stringify(image)], {type: "octet/stream"});
	postMessage(["RES",blob]);//Send data to main thread
	
	self.close();// Close the worker
}