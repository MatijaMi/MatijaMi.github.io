self.importScripts('../Decode/decompress.js','../Decode/decodeUtils.js','../Decode/unslicing.js');
self.importScripts('../byteTransformations.js','../Decode/interpolations.js','../Decode/colorConversion.js');

onmessage=function(e){
	var bitTime = new Date();
	var metaData = e.data[1];
	var mode ="d"+e.data[3];//Either rggb, yycc or yyyycc
	//The values need to be decompressed first
	var image =decompressValues(transformBytesToBits(e.data[0]),metaData);
	//Applying the correct unslicing and post processing functions on the image
	switch(mode){
		case "drggb":		
			if(metaData.get("Slices")[0]>0){//0 means there is only one slice,therefore no unslicing is needed
				image = unsliceRGGB(image,metaData);
			}
			if(e.data[2]==true){	
				image=bayerInterpolation(image);
				mode="drgb";
			}
			break;
			
		case "dyycc":
			if(metaData.get("Slices")[0]>0){
				image = unsliceYCbCr(image,metaData);
			}
			image = interpolateYCC(image, metaData);
			if(e.data[2]==true){
				image=convertToRGB(image,"YYCC");			
				mode="drgb";
			}
			break;
		
		case "dyyyycc":
			if(metaData.get("Slices")[0]>0){
				image = unsliceYYYYCbCr(image,metaData);
			}
			image = interpolateYYYYCbCr(image,metaData);
			if(e.data[2]==true){
				image=convertToRGB(image,"YYYYCC");
				mode="drgb";
			}
			break;	
	}
	postMessage(["DL"]);
	var blob = new Blob( [JSON.stringify(image)], {type: "octet/stream"});
	postMessage(["RES",blob,mode]);
	
	var end = new Date();
	console.log("TOTAL TIME: " + (end.getTime()-bitTime.getTime()));
	
	self.close();
}