self.importScripts('../Decode/Decompress.js','../Utils/DecodeUtils.js','../Decode/UnslicingFunctions.js');
self.importScripts('../Utils/ByteTransformations.js','../Decode/Interpolations.js','../Decode/colorConversion.js');
var window=self;

onmessage=function(e){
	getBits(e.data[0]);
	var metaData = e.data[1];
	var mode =e.data[3];
	
	var image =decompressValues(metaData);
	
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