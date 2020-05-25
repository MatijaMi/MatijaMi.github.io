self.importScripts('../Decode/DecodeValues.js','../Utils/DecodeUtils.js');
self.importScripts('../Utils/ByteTransformations.js','../Utils/Interpolations.js');
var window=self;

onmessage=function(e){
	getBits(e.data[0]);
	var image =decompressValues(e.data[1]);
	var unslicedImage = unslice(image, e.data[1].get("Slices"), e.data[1].get("SOF3").get("NumberOfLines"),e.data[1].get("SOF3").get("SamplesPerLine"));
	
	if(e.data[2]==true){
		image=bayerInterpolation(unslicedImage);
	}
	
	postMessage(["DL"]);
	var blob = new Blob([image], {type: "octet/stream"});
	postMessage(["RES",blob]);
}