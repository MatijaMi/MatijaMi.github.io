/*	Takes the values in their table form and returns them
	in the properly sliced order */
function unsliceRGGB(image, metaData){
	//Values needed for unslicing
	var slices =metaData.get("Slices"); 
	var sof3= metaData.get("SOF3");
	var height=sof3.get("NumberOfLines");
	var width=sof3.get("SamplesPerLine");
	var nComponents=sof3.get("ImageComponents");
	var HSF=sof3.get("HSF");
	var VSF=sof3.get("VSF");
	var numberOfEntries=getNumberOfEntries(nComponents,HSF,VSF);
	var trueWidth=width * nComponents;
	var samplePointer=0;
	var totalNofEntries = trueWidth*height;
	//Initialising
	var imageLines=[];
	for(let k =0; k <height;k++){
		imageLines.push([]);
	}
	//Going through every slice
	for(let j=0; j<slices[0]+1;j++){
		
		if(j==slices[0]){
			numberOfSamples= slices[2];
		}else{
			numberOfSamples= slices[1];
		}
				
		var numberOfValuesPerSample = numberOfSamples*height;
		
		for(let i =0; i<numberOfValuesPerSample;i++){
			var currentPointer=samplePointer+i;
			var currentEntry = image[Math.floor(currentPointer/trueWidth)][currentPointer%trueWidth];
			imageLines[Math.floor(i/numberOfSamples)].push(currentEntry);	
			
			//Progress bar update
			progressBarUpdate(currentPointer,Math.floor(totalNofEntries/100),"Unslicing Image");
		}
		//Sample pointer used to keep track of where we are in the input
		samplePointer=samplePointer+numberOfValuesPerSample;
	}
	return imageLines;
}

//Same as above but for YYCC, might get merged into a single function once YYYYCbCr is done
function unsliceYCbCr(image, metaData){
	var slices=metaData.get("Slices");
	var sof3=metaData.get("SOF3");
	var numberOfLines= sof3.get("NumberOfLines");
	var width=image[0].length;
	var nComponents=sof3.get("ImageComponents")
	var imageLines=[];
	var totalNofEntries = width*numberOfLines;
	for(let k =0; k <numberOfLines;k++){
		imageLines.push([]);
	}
	var numberOfEntries=4;
	var tablePointer=0;
	
	for(let k =0; k <slices[0]+1;k++){
		
		if(k==slices[0]){
			var sliceWidth=slices[2]/2;
		}else{
			var sliceWidth=slices[1]/2;
		}
		
		var numberOfEntriesPerSlice=numberOfLines*sliceWidth*2;
		for(let i =0; i <numberOfEntriesPerSlice;i+=4){
			
			var currentElement=i+tablePointer;
			var row =Math.floor(currentElement/width);
			var col =currentElement%width;
			var y1 = image[row][col];
			var y2 = image[row][col+1];
			var cb = image[row][col+2];
			var cr = image[row][col+3];
			var currentLine=imageLines[Math.floor((i/2)/sliceWidth)];
			
			currentLine.push([y1,cb,cr]);
			currentLine.push([y2]);
			
			//Progress bar update
			progressBarUpdate(currentElement,Math.floor(totalNofEntries/100),"Unslicing Image");
		}
		
		tablePointer+=numberOfEntriesPerSlice;
	}
	return imageLines;
}
//Same as above but for YYYYCC, might get merged into a single function once it is done
function unsliceYYYYCbCr(image,metaData){
	var slices=metaData.get("Slices"); 
	var sof3 =metaData.get("SOF3");
	var numberOfLines= sof3.get("NumberOfLines");
	var width=	image[0].length;
	var nComponents=sof3.get("ImageComponents");
	var imageLines=[];
	var totalNofEntries= width*numberOfLines;
	
	for(let m =0; m <numberOfLines;m++){
		imageLines.push([]);
	}
	var numberOfEntries=6;
	var tablePointer=0;
	for(let k =0; k <slices[0]+1;k++){
		
		if(k==slices[0]){
			var sliceWidth=slices[2]/3;
		}else{
			var sliceWidth=slices[1]/3;
		}
		
		var numberOfEntriesPerSlice=numberOfLines*sliceWidth*1.5;
		for(let i =0; i <numberOfEntriesPerSlice;i+=6){
			
			var currentElement=i+tablePointer;
			var row = Math.floor(currentElement/width);
			var col = currentElement%width;
			var y1 = image[row][col];
			var y2 = image[row][col+1];
			var y3 = image[row][col+2];
			var y4 = image[row][col+3];
			var cb = image[row][col+4];
			var cr = image[row][col+5];
			
			
			var currentLine=imageLines[Math.floor((i/3)/(sliceWidth))*2];
			currentLine.push([y1,cb,cr]);
			currentLine.push([y2]);
			
			currentLine=imageLines[(Math.floor((i/3)/(sliceWidth))*2)+1];
			currentLine.push([y3]);
			currentLine.push([y4]);
			
			//Progress bar update
			progressBarUpdate((currentElement/6),Math.floor(totalNofEntries/600),"Unslicing Image");
		}
		tablePointer+=numberOfEntriesPerSlice;
	}
	return imageLines;
}


