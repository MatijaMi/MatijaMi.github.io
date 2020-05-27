self.importScripts('../Decode/YYCbCr.js','../Decode/DecodeValues.js','../Utils/DecodeUtils.js');
self.importScripts('../Utils/ByteTransformations.js', '../Utils/Interpolations.js');

var window=self;
onmessage=function(e){
	getBits(e.data[0]);
	var metaData = e.data[1];
	var sof3=metaData.get("SOF3");
	var image = decompressValues(metaData);
	image = unsliceYCbCr(image, 
					metaData.get("Slices"), 
					sof3.get("NumberOfLines"),
					image[0].length,
					sof3.get("ImageComponents"));
	image =interpolateYCC(image);
	if(e.data[2]==true){
		image=YCCtoRGB(image);
	}
	postMessage(["DL"]);
	var blob = new Blob([image], {type: "octet/stream"});
	postMessage(["RES",blob]);
}