self.importScripts('../Decode/YYCbCr.js','../Decode/DecodeValues.js','../Utils/DecodeUtils.js');
self.importScripts('../Utils/ByteTransformations.js', '../Utils/Interpolations.js');

var window=self;
onmessage=function(e){
	
	var image = decompressYCC(e.data[0],e.data[1]);
	
	if(e.data[2]==true){
		image=YCCtoRGB(interpolateYCC(image));
	}
	postMessage(["DL"]);
	var blob = new Blob([image], {type: "octet/stream"});
	postMessage(["RES",blob]);
}