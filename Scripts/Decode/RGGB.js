function decompressRGGB(data, mData){

	getBits(data);
	var metaData=mData;
	var ht1 =metaData.get("HT1");
	var ht2 =metaData.get("HT2");
	var numberOfLines = metaData.get("SOF3").get("NumberOfLines");
	var samplesPerLine = metaData.get("SOF3").get("SamplesPerLine");
	var HSF = metaData.get("SOF3").get("HSF");
	var sliceDimensions = metaData.get("Slices");
	var samplePrecision = metaData.get("SOF3").get("SamplePrecision");
	var numberOfComponents = metaData.get("SOF3").get("ImageComponents");
	
	
	window.bitPointer=0;
	if(numberOfComponents==2){
		 var imageLines=decompress2V(numberOfLines,HSF,sliceDimensions,samplePrecision,ht1,ht2,samplesPerLine);
	}else{
		 var imageLines=decompress4V(numberOfLines,HSF,sliceDimensions,samplePrecision,ht1,ht2);
	}
	
	
	return imageLines;
	
}

function limitComponent(comp, sp){
	//var maxValue =16100;
	var maxValue =Math.pow(2,sp)-1;
	
	if(comp>maxValue){
		comp=comp%(maxValue+1);
		//comp=maxValue;
	}else{
		if(comp<0){
			comp=comp+maxValue;
		}
	}
	return comp;
}
