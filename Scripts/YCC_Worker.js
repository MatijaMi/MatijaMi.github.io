self.importScripts('YYCbCr.js','ByteTransformations.js');
var window=self;
onmessage=function(e){
	
	var image =decompressYCC(e.data[0],e.data[1]);
	if(e.data[2]==true){
		image=YCCtoRGB(interpolateYCC(image));
	}
	postMessage(["RES",image]);
}