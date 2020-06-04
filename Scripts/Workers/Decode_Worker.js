self.importScripts('../Decode/Decompress.js','../Utils/DecodeUtils.js','../Decode/UnslicingFunctions.js');
self.importScripts('../Utils/ByteTransformations.js','../Decode/Interpolations.js','../Decode/colorConversion.js');
var window=self;

onmessage=function(e){
	var bitTime = new Date();
	getBits(e.data[0]);//Transforming the bytes into bits
	var finTime = new Date();
	console.log("BIT TIME " + (finTime.getTime()-bitTime.getTime()));
	var metaData = e.data[1];
	var mode =e.data[3];//Either rggb, yycc or yyyycc
	//The values need to be decompressed first
	var a = new Date();
	var image =decompressValues(metaData);
	var c = new Date();
	console.log("DECOMPRESS TIME " +(c.getTime()-a.getTime()));
	//Applying the correct unslicing and post processing functions on the image
	switch(mode){
		case "rggb":
			var d = new Date();			
			image = unsliceRGGB(image,metaData);
			
			var b =new Date();
			console.log("UNSLICE TIME " +(b.getTime()-d.getTime()));
			if(e.data[2]==true){
				image=bayerInterpolation(image);
				mode="drgb";
			}
			//image = applyWhiteBalance(image,metaData);
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