function decompress2V(numberOfLines,HSF,sliceDimensions,samplePrecision,ht1,ht2,samplesPerLine){
	var imageLines=[];
	for(var k =0; k <numberOfLines;k++){
		imageLines.push([]);
	}
	
	var width = samplesPerLine;
	console.log(width);
	var height= numberOfLines;
	var acWidth= width/HSF;
	var prevC1=Math.pow(2,samplePrecision-1);
	var prevC2=Math.pow(2,samplePrecision-1);
	
	for(var i =0; i < height;i++){
		if(i>0){
			prevC1=imageLines[i-1][0];
			prevC2=imageLines[i-1][1];
		}
		for(var j =0; j <width;j++){
			prevC1 = findNextValue(ht1, prevC1);
			prevC1= limitComponent(prevC1,samplePrecision);
			
			prevC2 = findNextValue(ht2, prevC2);
			prevC2= limitComponent(prevC2,samplePrecision);
			
			imageLines[i].push(prevC1);
			imageLines[i].push(prevC2);	
		}
	}
	console.log(imageLines.length);
	console.log(imageLines[imageLines.length-1].length);
	var image= unslice(imageLines, sliceDimensions,numberOfLines,samplesPerLine);
	return image;
}

function cropBorders(image, top, left, bot , right){
	var croppedImage =[];
	for(var i=top;i<bot;i++){
		
		croppedImage.push(image[i].slice(left,right));
	}
	console.log("DONE");
	return croppedImage;
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
function decompress3V(numberOfLines,HSF,sliceDimensions,samplePrecision,ht1,ht2){
	var imageLines=[];
	for(var k =0; k <numberOfLines;k++){
		imageLines.push([]);
	}
	for(var j =0; j< sliceDimensions[0]+1;j++){
		var numberOfSamples;
		var sample =[];
		
		var pbPart=Math.floor(100/(sliceDimensions[0]+1));

		if(j==sliceDimensions[0]){
			numberOfSamples= sliceDimensions[2]/HSF;
		}else{
			numberOfSamples= sliceDimensions[1]/HSF;
		}
		
		var counter = numberOfSamples*numberOfLines;
		
		var Y,Cb,Cr;
		var i =0;
		
		var prevY=Math.pow(2,samplePrecision-1);
		var prevCb=0;
		var prevCr=0;
		while(i<counter){
			
			if(i%(Math.floor(counter/pbPart))==0){
				postMessage(["PB", (j*pbPart+(i/(Math.floor(counter/pbPart)))),"Extracting Values"]);
			}
		
			if(i>0 && i%numberOfSamples==0){
				prevY=imageLines[Math.floor(i/numberOfSamples)-1][0][0];
				prevCb=imageLines[Math.floor(i/numberOfSamples)-1][0][1];
				prevCr=imageLines[Math.floor(i/numberOfSamples)-1][0][2];
			
			}
			
			sample=[];
			
			Y = findNextValue(ht1, prevY);
			Y=limitY(Y,samplePrecision);
			
			
			sample.push(Y);
			prevY=Y;
			
			Y = findNextValue(ht1, prevY);
			Y=limitY(Y,samplePrecision);
			prevY=Y;
			
			Cb = findNextValue(ht2, prevCb);
			Cb= limitC(Cb,samplePrecision);
			sample.push(Cb);
			prevCb=Cb;
			
			Cr = findNextValue(ht2, prevCr);
			Cr= limitC(Cr,samplePrecision);
			sample.push(Cr);
			prevCr=Cr;
			
			imageLines[Math.floor(i/numberOfSamples)].push(sample);
			i++;
			sample = [];
			sample.push(Y);
			imageLines[Math.floor(i/numberOfSamples)].push(sample);
			i++;
		}	
	}
	return imageLines;
}

function decompress4V(numberOfLines,HSF,sliceDimensions,samplePrecision,ht1,ht2){
	var imageLines=[];
	for(var k =0; k <numberOfLines;k++){
		imageLines.push([]);
	}
	for(var j =0; j< sliceDimensions[0]+1;j++){
		console.log("Slice " +j);
		
		var numberOfSamples;
		var pbPart=Math.floor(100/(sliceDimensions[0]+1));
		
		if(j==sliceDimensions[0]){
			numberOfSamples= sliceDimensions[2]/HSF;
		}else{
			numberOfSamples= sliceDimensions[1]/HSF;
		}
				
		var counter = numberOfSamples*numberOfLines;
		console.log("Counter =" +counter);
		var i =0;
		var prevC1=Math.pow(2,samplePrecision-1);
		var prevC2=Math.pow(2,samplePrecision-1);
		var prevC3=Math.pow(2,samplePrecision-1);
		var prevC4=Math.pow(2,samplePrecision-1);
		while(i<counter){
			
			if(i%(Math.floor(counter/pbPart))==0){
				postMessage(["PB", (j*pbPart+(i/(Math.floor(counter/pbPart)))),"Extracting Values"]);
			}
			
			if(i>0 && i%numberOfSamples==0){
				prevC1=imageLines[Math.floor(i/numberOfSamples)-1][0];
				prevC2=imageLines[Math.floor(i/numberOfSamples)-1][1];
				prevC3=imageLines[Math.floor(i/numberOfSamples)-1][2];
				prevC4=imageLines[Math.floor(i/numberOfSamples)-1][3];
			}
			prevC1 = findNextValueR(ht1, prevC1);
			prevC1= limitComponent(prevC1,samplePrecision);
			
			prevC2 = findNextValueR(ht2, prevC2);
			prevC2= limitComponent(prevC2,samplePrecision);
			
			prevC3 = findNextValueR(ht1, prevC3);
			prevC3= limitComponent(prevC3,samplePrecision);
			
			prevC4 = findNextValueR(ht2, prevC4);
			prevC4= limitComponent(prevC4,samplePrecision);
			
			imageLines[Math.floor(i/numberOfSamples)].push(prevC1);
			imageLines[Math.floor(i/numberOfSamples)].push(prevC2);
			imageLines[Math.floor(i/numberOfSamples)].push(prevC3);
			imageLines[Math.floor(i/numberOfSamples)].push(prevC4);
			i+=4;
		}	
		
	}
	return imageLines
}
