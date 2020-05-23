self.importScripts('YYCbCr.js','ByteTransformations.js');
var window=self;
onmessage=function(e){
	
	var image =interpolateYCC(decompressYCC(e.data[0],e.data[1]));
	if(e.data[2]==true){
		image=YCCtoRGB(interpolateYCC(image));
	}
	var blob = new Blob([image], {type: "octet/stream"});
	postMessage(["RES",blob]);
}