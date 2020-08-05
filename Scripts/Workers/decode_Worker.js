self.importScripts('../Decode/decompress.js','../Decode/decodeUtils.js','../Decode/unslicing.js');
self.importScripts('../Util/byteTransformations.js','../Decode/interpolations.js','../Decode/colorConversion.js','../Decode/postProcessing.js','../Util/matrixFunctions.js');

onmessage=function(e){
	var bitTime = new Date();
	var metaData = e.data[1];
	var colorFormat =e.data[2];//Either rggb, yycc or yyyycc
	var decodeMode = e.data[3];
	//The values need to be decompressed first
	var image =decompressValues(transformBytesToBits(e.data[0]),metaData);
	//Applying the correct unslicing and post processing functions on the image
	switch(colorFormat){
		case "drggb":		
			if(metaData.get("Slices")[0]>0){//0 means there is only one slice,therefore no unslicing is needed
				image = unsliceRGGB(image,metaData);
			}
			if(isGRBG(image)){
				image.shift();//Remove first line
			}
			
			if(decodeMode!="pure"){
				image=applyWhiteBalance(image,metaData);
			}
			
			image=bayerInterpolation(image);
			
			if(decodeMode=="full"){
				image=correctGamma(convertTosRGB(image,metaData));
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
	
	postMessage(["DL"]);
	var blob = new Blob( [JSON.stringify(image)], {type: "octet/stream"});
	postMessage(["RES",blob]);
	
	var end = new Date();
	console.log("TOTAL TIME: " + (end.getTime()-bitTime.getTime()));
	
	self.close();
}