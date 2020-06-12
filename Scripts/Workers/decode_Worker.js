self.importScripts('../Decode/decompress.js','../Decode/decodeUtils.js','../Decode/unslicing.js');
self.importScripts('../byteTransformations.js','../Decode/interpolations.js','../Decode/colorConversion.js');


onmessage=function(e){
	var bitTime = new Date();
	var bits=transformBytesToBits(e.data[0]);//Transforming the bytes into bits
	var finTime = new Date();
	console.log("BIT TIME " + (finTime.getTime()-bitTime.getTime()));
	var metaData = e.data[1];
	var mode ="d"+e.data[3];//Either rggb, yycc or yyyycc
	//The values need to be decompressed first
	var a = new Date();
	var image =decompressValues(bits,metaData);
	bits=[];
	var c = new Date();
	console.log("DECOMPRESS TIME " +(c.getTime()-a.getTime()));
	//Applying the correct unslicing and post processing functions on the image
	switch(mode){
		case "drggb":
						
			image = unsliceRGGB(image,metaData);
			if(e.data[2]==true){			
				image=bayerInterpolation(image);
				mode="drgb";
			}
			break;
			
		case "dyycc":
			
			image = unsliceYCbCr(image, metaData);
			image = interpolateYCC(image);
			if(e.data[2]==true){
				image=YCCtoRGB(image);			
				mode="drgb";
			}
			break;
		
		case "dyyyycc":
			
			image = unsliceYYYYCbCr(image,metaData);
			image = interpolateYYYYCbCr(image);
			if(e.data[2]==true){
				image=YYYYCbCrtoRGB(image);
				mode="drgb";
			}
			break;	
	}
	postMessage(["DL"]);
	var blob = new Blob( [JSON.stringify(image)], {type: "octet/stream"});
	postMessage(["RES",blob,mode]);
	self.close();
}