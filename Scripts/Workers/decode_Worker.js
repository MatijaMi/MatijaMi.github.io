self.importScripts('../Decode/decompress.js','../Decode/decodeUtils.js','../Decode/unslicing.js');
self.importScripts('../Util/byteTransformations.js','../Decode/interpolations.js','../Decode/colorConversion.js','../Decode/postProcessing.js','../Util/matrixFunctions.js');

onmessage=function(e){
	var metaData = e.data[1];
	var colorFormat =e.data[2];//Either rggb, yycc or yyyycc
	var decodeMode = e.data[3];
	var cropMode = e.data[4];
	//The values need to be decompressed first
	var d0 = new Date();
	var image =transformBytesToBits(e.data[0]);
	var d1 = new Date();
	image =decompressValues(image,metaData);
	var d2 = new Date();
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
	var d3 = new Date();
	if(decodeMode>0){
		image=normalizeImage(image,metaData);
	}
	var d4 = new Date();
	if(decodeMode>1){
		image=applyWhiteBalance(image,metaData);
	}
	var d5 = new Date();
	if(decodeMode>2 && colorFormat.includes("drggb")){
		image=bayerInterpolation(image);
	}
	var d6 = new Date();
	if(cropMode){
		image=cropImage(image,metaData);
	}
	var d7 = new Date();
	if(decodeMode>3){
		image=convertTosRGB(image,metaData);
	}
	var d8 = new Date();
	if(decodeMode>4){
		image=brightenImage(image);
		var d85 = new Date();
		image=correctGamma(image);
	}
	
	
	postMessage(["DL"]);
	var d9 = new Date();
	var blob = new Blob( [JSON.stringify(image)], {type: "octet/stream"});
	postMessage(["RES",blob]);
	
	var end = new Date();
	console.log("Bit Time: " + (d1.getTime()-d0.getTime())/1000);
	console.log("Decompress: " + (d2.getTime()-d1.getTime())/1000);
	console.log("Unslice: " + (d3.getTime()-d2.getTime())/1000);
	console.log("Normalize Time: " + (d4.getTime()-d3.getTime())/1000);
	console.log("WB Time: " + (d5.getTime()-d4.getTime())/1000);
	console.log("CFA Inter Time: " + (d6.getTime()-d5.getTime())/1000);
	console.log("Crop Time: " + (d7.getTime()-d6.getTime())/1000);
	console.log("CSC Time: " + (d8.getTime()-d7.getTime())/1000);
	console.log("BC Time: " + (d85.getTime()-d8.getTime())/1000);
	console.log("GC Time: " + (d9.getTime()-d85.getTime())/1000);
	console.log("DLPrep Time: " + (end.getTime()-d9.getTime())/1000);
	console.log("TOTAL TIME: " + (end.getTime()-d0.getTime())/1000);
	
	self.close();
}