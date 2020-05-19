self.importScripts('RGGB.js','ByteTransformations.js','BayerInterpolation.js');
var window=self;
onmessage=function(e){
	
	var image =decompressRGGB(e.data[0],e.data[1]);
	if(e.data[2]==true){
		image=bayerInterpolation(image);
		console.log("INTERPOLATING");
	}
	postMessage(["RES",image]);
}