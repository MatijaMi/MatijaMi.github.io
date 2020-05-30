self.importScripts('../Decode/Decompress.js','../Utils/DecodeUtils.js','../Decode/UnslicingFunctions.js');
self.importScripts('../Utils/ByteTransformations.js','../Utils/Interpolations.js');
var window=self;

onmessage=function(e){
	getBits(e.data[0]);
	var metaData = e.data[1];
	var image =decompressValues(metaData);
	var sof3= metaData.get("SOF3");
	
	image = unsliceRGGB(image, 
						metaData.get("Slices"), 
						sof3.get("NumberOfLines"),
						sof3.get("SamplesPerLine"),
						sof3.get("ImageComponents"),
						sof3.get("HSF"),
						sof3.get("VSF"));
	if(e.data[2]==true){
		image=bayerInterpolation(image);
	}
	image = applyWhiteBalance(image,metaData);

	postMessage(["DL"]);
	var blob = new Blob([image], {type: "octet/stream"});
	postMessage(["RES",blob]);
}