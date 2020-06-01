self.importScripts('../Decode/Decompress.js','../Utils/DecodeUtils.js','../Decode/UnslicingFunctions.js');
self.importScripts('../Utils/ByteTransformations.js','../Decode/Interpolations.js','../Decode/colorConversion.js');
var window=self;

onmessage=function(e){
	
	getBits(e.data[0]);//Transforming the bytes into bits
	var metaData = e.data[1];
	var mode =e.data[3];//Either rggb, yycc or yyyycc
	//The values need to be decompressed first
	var image =decompressValues(metaData);
	//Applying the correct unslicing and post processing functions on the image
	switch(mode){
		case "rggb":
			image = unsliceRGGB(image,metaData);
			if(e.data[2]==true){
				image=bayerInterpolation(image);
				mode="drgb";
			}
			image = applyWhiteBalance(image,metaData);
			break;
			
		case "yycc":
			image = unsliceYCbCr(image, metaData);
			image =interpolateYCC(image);
			if(e.data[2]==true){
				image=YCCtoRGB(image);
				mode="drgb";
			}
			break;
		
		case "yyyycc":
			image = unsliceYYYYCbCr(image,metaData);
			image=interpolateYYYYCbCr(image);
			if(e.data[2]==true){
				image=YYYYCbCrtoRGB(image);
				mode="drgb";
			}
			break;	
	}
	postMessage(["DL"]);
	var blob = new Blob([image], {type: "octet/stream"});
	postMessage(["RES",blob,mode]);
}