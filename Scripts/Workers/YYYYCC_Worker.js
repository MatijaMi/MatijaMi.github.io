self.importScripts('../Decode/Decompress.js','../Utils/DecodeUtils.js','../Decode/UnslicingFunctions.js');
self.importScripts('../Utils/ByteTransformations.js','../Utils/Interpolations.js','../Decode/YYYYCbCr.js');
var window=self;

onmessage=function(e){
	getBits(e.data[0]);
	var metaData = e.data[1];
	var image =decompressValues(metaData);
	var sof3= metaData.get("SOF3");
	
	image = unsliceYYYYCbCr(image, 
						metaData.get("Slices"), 
						image.length,
						image[0].length,
						sof3.get("ImageComponents"));
	if(e.data[2]==true){
		image=interpolateYYYYCbCr(image);
	}
	image=YYYYCbCrtoRGB(image);
	
	postMessage(["DL"]);
	var blob = new Blob([image], {type: "octet/stream"});
	postMessage(["RES",blob]);
}