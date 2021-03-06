/* Given the meta data decompresses the raw bytes to the actual values*/
function decompressValues(bits,mData){
	//Needed data
	var metaData=mData;
	var sos = metaData.get("SOS");
	var ht1 = metaData.get("HT1");
	var ht2 = metaData.get("HT2");
	var sof3 = metaData.get("SOF3");
	var numberOfLines = sof3.get("NumberOfLines");
	var samplesPerLine = sof3.get("SamplesPerLine");
	var samplePrecision = sof3.get("SamplePrecision");
	var nComponents = sof3.get("ImageComponents");
	var HSF = sof3.get("HSF");
	var VSF = sof3.get("VSF");
	var compParts = setupComponentParts(HSF,VSF);
	var hts = setupHTS(sos,ht1,ht2,nComponents);
	var previousValues = setPreviousValues(nComponents,samplePrecision);
	var imageLines=[];
	var samples=samplesPerLine/(HSF*VSF);
	bitPointer=0;//Initialising the bit pointer
	for(let i =0; i < numberOfLines;i++){
		var newRow=[];//newLine
		/*On all lines except the first, the previous value is taken
		from the previous line, from the first occurence of the component*/
		if(i>0){
			previousValues=adjustPreviousValues(imageLines,i,nComponents,compParts[0],previousValues);
		}
		for(let j =0; j <samples;j++){//For every line
			for(let comps = 0; comps<nComponents;comps++){//For every component
				for(let part=0; part<compParts[comps];part++){//For every repetition of the component
					previousValues[comps]=findNextValue(hts[comps],previousValues[comps],bits);//Find the next value
					newRow.push(previousValues[comps]);//And save it
				}
			}
		}
		imageLines.push(newRow);
		progressBarUpdate(i,Math.floor(numberOfLines/100),"Decompressing Values");
	}
	return imageLines;
}