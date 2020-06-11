/* Given the meta data decompressed the raw bytes to the actual values*/
function decompressValues(bits,mData){
	//Needed data
	var metaData=mData;
	var sliceDimensions = metaData.get("Slices");
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
	
	//Initialising the bit pointer
	self.bitPointer=0;
	for(var i =0; i < numberOfLines;i++){
		if(i%(Math.floor(numberOfLines/100))==0){
			postMessage(["PB",i/(Math.floor(numberOfLines/100)),"Decompressing Data"]);
		}
		imageLines.push([]);//newLine
		/*On all lines except the first, the previous value is taken
		from the previous line, from the first occurence of the component*/
		if(i>0){
			for(var comp=0; comp<nComponents;comp++){		
				if(compParts[0]==4){
					if(i%2==0){ //In YYYYCbCr the previous values get reset every 2 lines
						if(comp==0){
							previousValues[comp]=imageLines[i-2][comp];//Adjusting for additional Ys
						}else{
							previousValues[comp]=imageLines[i-2][comp+3];//Adjusting for additional Ys
						}
					}	
				}else{
					if(compParts[0]==2 && comp>0){
						previousValues[comp]=imageLines[i-1][comp+1];//Adjusting for additional Ys
					}else{
						previousValues[comp]=imageLines[i-1][comp];	
					}
				}
			}	
		}
		
		for(var j =0; j <(samplesPerLine/(HSF*VSF));j++){//For every line
			for(var comps = 0; comps<nComponents;comps++){//For every component
				for(var part=0; part<compParts[comps];part++){//For every repetition of the component
					previousValues[comps]=findNextValue(hts[comps],previousValues[comps],bits);//Find the next value
					imageLines[i].push(previousValues[comps]);//And save it
				}
			}
		}
	}
	return imageLines;
}
