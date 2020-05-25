function decompressValues(mData){
	
	
	window.bitPointer=0;
	var metaData=mData;
	var sof3 = metaData.get("SOF3");
	var numberOfLines = sof3.get("NumberOfLines");
	var samplesPerLine = sof3.get("SamplesPerLine");
	var sliceDimensions = metaData.get("Slices");
	var samplePrecision = sof3.get("SamplePrecision");
	var nComponents = sof3.get("ImageComponents");
	var HSF = sof3.get("HSF");
	var VSF = sof3.get("VSF");
	var sos = metaData.get("SOS");
	var ht1 = metaData.get("HT1");
	var ht2 = metaData.get("HT2");
	
	var compParts = setupComponentParts(HSF,VSF);
	var hts = setupHTS(sos,ht1,ht2,nComponents);
	var previousValues = setPreviousValues(nComponents,samplePrecision);
	
	var imageLines=[];
	for(var i =0; i < numberOfLines;i++){
		imageLines.push([]);
		if(i>0){
			for(var comp=0; comp<nComponents;comp++){
				previousValues[comp]=imageLines[i-1][comp];
			}
		}
		for(var j =0; j <samplesPerLine;j++){
			for(var comps = 0; comps<nComponents;comps++){
				for(var part=0; part<compParts[comps];part++){
					previousValues[comps]=findNextValue(hts[comps],previousValues[comps]);
					imageLines[i].push(previousValues[comps]);
				}
			}
		}
	}
	return imageLines;
}

function unslice(image, slices, height,widthx){
	var imageLines=[];
	for(var k =0; k <height;k++){
		imageLines.push([]);
	}
	var width=widthx*2;
	var slice1=height*slices[1];
	
	for(var j=0; j<slices[0]+1;j++){
		if(j==slices[0]){
			numberOfSamples= slices[2];
		}else{
			numberOfSamples= slices[1];
		}
				
		var counter = numberOfSamples*height;
		console.log("COUNTER " +counter);
		for(var i =0; i<counter;i++){
			var z=j*slice1+i;
			var x = image[Math.floor(z/width)][z%width];
			imageLines[Math.floor(i/numberOfSamples)].push(x);
		}
		console.log("LENGTH " +imageLines[1].length);
		console.log(j);
	}
	
	return imageLines;
}


function cropBorders(image, top, left, bot , right){
	var croppedImage =[];
	for(var i=top;i<bot;i++){
		croppedImage.push(image[i].slice(left,right));
	}
	return croppedImage;
}

function setupHTS(sos,ht1,ht2,numberOfComponents){
	var hts=[];
	for(var k =0; k <numberOfComponents;k++){
		if(sos.get("DCAC"+k)==0){
			hts.push(ht1);
		}else{
			hts.push(ht2);
		}
	}
	return hts;
}

function setupComponentParts(HSF,VSF){
	if(HSF==1){
		var compParts=[1,1,1,1];
	}else{
		if(VSF==1){
			var compParts=[2,1,1];
		}else{
			var compParts=[4,1,1];
		}
	}
	return compParts;
}

function setPreviousValues(nComponents,samplePrecision){
	var previousValues = [];
	for(var k =0; k<nComponents;k++){
		if(nComponents!=3 || k==0){
			previousValues[k]=Math.pow(2,samplePrecision-1);
		}else{
			previousValues[k]=0;
		}
	}
	return previousValues;
}