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
	console.log(compParts);
	var imageLines=[];
	for(var i =0; i < numberOfLines;i++){
		imageLines.push([]);
		if(i>0){
			
			for(var comp=0; comp<nComponents;comp++){
				if(compParts[0]==2 && comp>0){
					previousValues[comp]=imageLines[i-1][comp+1];
				}else{
					
					if(compParts[0]==4 && comp >0){
						previousValues[comp]=imageLines[i-1][comp+3];
					}else{
						previousValues[comp]=imageLines[i-1][comp];	
					}
				}
			}
			
		}
		
		for(var j =0; j <(samplesPerLine/HSF)/VSF;j++){
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
