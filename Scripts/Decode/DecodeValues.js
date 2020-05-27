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
				if(nComponents==3 && comp>0){
					previousValues[comp]=imageLines[i-1][comp+1];
				}else{
					previousValues[comp]=imageLines[i-1][comp];	
				}
				
			}
		}
		for(var j =0; j <(samplesPerLine/HSF);j++){
			for(var comps = 0; comps<nComponents;comps++){
				for(var part=0; part<compParts[comps];part++){
					previousValues[comps]=findNextValue(hts[comps],previousValues[comps]);
					imageLines[i].push(previousValues[comps]);
				}
			}
		}
	}
	console.log(imageLines.length);
	console.log(imageLines[imageLines.length-1].length);
	return imageLines;
}

function unsliceRGGB(image, slices, height,width,nComponents,HSF,VSF){
	var imageLines=[];
	for(var k =0; k <height;k++){
		imageLines.push([]);
	}
	var numberOfEntries=getNumberOfEntries(nComponents,HSF,VSF);
	var trueWidth=width*2;
	var samplePointer=0;
	for(var j=0; j<slices[0]+1;j++){
		
		if(j==slices[0]){
			numberOfSamples= slices[2];
		}else{
			numberOfSamples= slices[1];
		}
				
		var counter = numberOfSamples*height;
		
		for(var i =0; i<counter;i++){
			var currentPointer=samplePointer+i;
			var currentEntry = image[Math.floor(currentPointer/trueWidth)][currentPointer%trueWidth];
			imageLines[Math.floor(i/numberOfSamples)].push(currentEntry);	
		}
		samplePointer=samplePointer+counter;
	}
	return imageLines;
}

function unsliceYCbCr(image, slices, numberOfLines,width,nComponents){
	var imageLines=[];
	for(var k =0; k <numberOfLines;k++){
		imageLines.push([]);
	}
	var numberOfEntries=4;
	var tablePointer=0;
	
	for(var k =0; k <slices[0]+1;k++){
		
		if(k==slices[0]){
			var sliceWidth=slices[2]/2;
		}else{
			var sliceWidth=slices[1]/2;
		}
		
		var numberOfEntriesPerSlice=numberOfLines*sliceWidth*2;
		for(var i =0; i <numberOfEntriesPerSlice;i+=4){
			
			var currentElement=i+tablePointer;
			var row =Math.floor(currentElement/width);
			var col =currentElement%width;
			var y1 = image[row][col];
			var y2 = image[row][col+1];
			var cb = image[row][col+2];
			var cr = image[row][col+3];
			var currentLine=imageLines[Math.floor((i/2)/sliceWidth)];
			
			currentLine.push([]);
			
			currentLine[currentLine.length-1].push(y1);
			currentLine[currentLine.length-1].push(cb);
			currentLine[currentLine.length-1].push(cr);
			
			currentLine.push([]);
			currentLine[currentLine.length-1].push(y2);
		}
		tablePointer+=numberOfEntriesPerSlice;
	}
	return imageLines;
}


