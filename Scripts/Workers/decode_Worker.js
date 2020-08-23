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
	var at =new Date();
	var image =transformBytesToBits(e.data[0]);
	var aat =new Date();
	console.log("BIT TIME:" +(aat.getTime()-at.getTime()));
	image =decompressValues(image,metaData);
	var aaat =new Date();
	console.log("BIT TIME:" +(aaat.getTime()-aat.getTime()));
	//Applying the correct unslicing and post processing functions on the image
	
	var bt =new Date();
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
	var ct =new Date();
	if(decodeMode>0){
		image=normalizeImage(image,metaData);
	}
	var dt =new Date();
	if(decodeMode>1){
		image=applyWhiteBalance(image,metaData);
	}	
	var et =new Date();
	if(decodeMode>2 && colorFormat.includes("drggb")){
		image=bayerInterpolation(image);
	}
	var ft =new Date();
	if(cropMode){
		image=cropImage(image,metaData);
	}
	var gt =new Date();
	if(decodeMode>3){
		image=convertTosRGB(image,metaData);
		var ht =new Date();
		if(brightnessMode){
			image=brightenImage(image);
			var it =new Date();
		}
		image=correctGamma(image);
		var jt =new Date();
	}
	var times = [at,aat,bt,ct,dt,et,ft,gt,ht,it,jt];
	for(var i =0; i <times.length-1;i++){
		console.log("dT:");
		console.log(times[i+1].getTime()-times[i].getTime());
	}
	postMessage(["DL"]);
	var blob = new Blob( [JSON.stringify(image)], {type: "octet/stream"});
	postMessage(["RES",blob]);
	
	var end = new Date();
	console.log("TOTAL TIME: " + (end.getTime()-bitTime.getTime()));
	
	self.close();
}