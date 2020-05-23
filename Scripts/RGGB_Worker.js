self.importScripts('RGGB.js','ByteTransformations.js','BayerInterpolation.js');
var window=self;
onmessage=function(e){
	
	var image =decompressRGGB(e.data[0],e.data[1]);
	if(e.data[2]==true){
		image=bayerInterpolation(image);
	}
	
	var blob = new Blob([image], {type: "octet/stream"});
	postMessage(["RES",blob]);
}