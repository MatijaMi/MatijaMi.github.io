function decompressYCC(data,mData){
	
	getBits(data);
	var metaData = mData;
	var ht1 =metaData.get("HT1");
	var ht2 =metaData.get("HT2");
	var numberOfLines = metaData.get("SOF3").get("NumberOfLines");
	var samplesPerLine = metaData.get("SOF3").get("samplesPerLine");
	var HSF = metaData.get("SOF3").get("HSF");
	var sliceDimensions = metaData.get("Slices");
	var samplePrecision = metaData.get("SOF3").get("SamplePrecision");
		
	window.bitPointer=0;
	
	var imageLines=decompress3V(numberOfLines,HSF,sliceDimensions,samplePrecision,ht1,ht2);
	return imageLines;
	
}

function YCCtoRGB(image){
	for(var i = 0; i <image.length;i++){
		for(var j =0; j<image[i].length;j++){
			var Y=image[i][j][0];
			var Cb=image[i][j][1];
			var Cr=image[i][j][2];
			
			var r =Y +1.6*Cr;
			var g =Y - 0.38*Cb - 0.8*Cr;
			var b =Y +2*Cb;
			image[i][j][0]=(r-512)*0.497;
			image[i][j][1]=(g-512)*1.146;
			image[i][j][2]=(b-512)*0.828;
			if(i%(Math.floor(image.length/100))==0){
				postMessage(["PB",i/(Math.floor(image.length/100)),"Converting to RGB"]);
			}
		}
	}
	return image;
}

function limitY(y, sp){
	var maxy= Math.pow(2,sp)-1;
	if(y>maxy){
		y=maxy;
	}else{
		if(y<0){
			y=0;
		}
	}
	
	return y;
}

function limitC(c,sp){
	var maxC= Math.pow(2,sp-1)-1;
	var minC=0-maxC;
	if(c>maxC){
		c=maxC;
	}else{
		if(c<minC){
			c=minC;
		}
	}
	return c;
}

