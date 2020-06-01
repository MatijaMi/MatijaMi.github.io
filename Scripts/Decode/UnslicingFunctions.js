function unsliceRGGB(image, metaData){
	var slices =metaData.get("Slices"); 
	var sof3= metaData.get("SOF3");
	var height=sof3.get("NumberOfLines");
	var width=sof3.get("SamplesPerLine");
	var nComponents=sof3.get("ImageComponents");
	var HSF=sof3.get("HSF");
	var VSF=sof3.get("VSF");
	
	var imageLines=[];
	for(var k =0; k <height;k++){
		imageLines.push([]);
	}
	var numberOfEntries=getNumberOfEntries(nComponents,HSF,VSF);
	var trueWidth=width * nComponents;
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

function unsliceYCbCr(image, metaData){
	var slices=metaData.get("Slices");
	var sof3=metaData.get("SOF3");
	var numberOfLines= sof3.get("NumberOfLines");
	var width=image[0].length;
	var nComponents=sof3.get("ImageComponents")
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

function unsliceYYYYCbCr(image,metaData){
	var slices=metaData.get("Slices"); 
	var sof3 =metaData.get("SOF3");
	var numberOfLines=	image.length;
	var width=	image[0].length;
	var nComponents=sof3.get("ImageComponents");
	var imageLines=[];
	
	for(var k =0; k <numberOfLines;k++){
		imageLines.push([]);
	}
	var numberOfEntries=6;
	var tablePointer=0;
	console.log(width);
	console.log(numberOfLines);
	for(var k =0; k <slices[0]+1;k++){
		
		if(k==slices[0]){
			var sliceWidth=slices[2]/3;
		}else{
			var sliceWidth=slices[1]/3;
		}
		
		var numberOfEntriesPerSlice=numberOfLines*sliceWidth*1.5;
		//console.log(numberOfEntriesPerSlice);
		
		for(var i =0; i <numberOfEntriesPerSlice;i+=6){
			
			var currentElement=i+tablePointer;
			var row =Math.floor(currentElement/width);
			var col =currentElement%width;
			var y1 = image[row][col];
			var y2 = image[row][col+1];
			var y3 = image[row][col+2];
			var y4 = image[row][col+3];
			var cb = image[row][col+4];
			var cr = image[row][col+5];
			
			
			var currentLine=imageLines[Math.floor((i/3)/(sliceWidth))*2];
			
			currentLine.push([]);
			
			currentLine[currentLine.length-1].push(y1);
			currentLine[currentLine.length-1].push(cb);
			currentLine[currentLine.length-1].push(cr);
			currentLine.push([]);
			currentLine[currentLine.length-1].push(y2);
			
			currentLine=imageLines[Math.floor((i/3)/(sliceWidth))*2+1];
			currentLine.push([]);
			currentLine[currentLine.length-1].push(y3);
			
			currentLine.push([]);
			currentLine[currentLine.length-1].push(y4);
		}
		tablePointer=tablePointer+numberOfEntriesPerSlice;
		
	}
	
	console.log(imageLines.length);
	for(var i =0;i< imageLines.length;i++){
		console.log(imageLines[i].length);
	}
	console.log(imageLines[0]);
	console.log(imageLines[1]);
	return imageLines;
}


