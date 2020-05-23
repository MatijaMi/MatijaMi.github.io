function decompressRGGB(data, mData){

	getBits(data);
	var metaData=mData;
	var ht1 =metaData.get("HT1");
	var ht2 =metaData.get("HT2");
	var numberOfLines = metaData.get("SOF3").get("NumberOfLines");
	var samplesPerLine = metaData.get("SOF3").get("samplesPerLine");
	var HSF = metaData.get("SOF3").get("HSF");
	var sliceDimensions = metaData.get("Slices");
	var samplePrecision = metaData.get("SOF3").get("SamplePrecision");
	var numberOfComponents = metaData.get("SOF3").get("ImageComponents");
	
	window.bitPointer=0;
	if(numberOfComponents==2){
		 var imageLines=decompress2V(numberOfLines,HSF,sliceDimensions,samplePrecision,ht1,ht2);
	}else{
		 var imageLines=decompress4V(numberOfLines,HSF,sliceDimensions,samplePrecision,ht1,ht2);
	}
	return imageLines;
	
}

function findNextValueR(huffTable, previousValue){
	
	var output=[];
	var byte = Math.floor(bitPointer/8);
	var bit = bitPointer%8;
	var i =0;
	
	while(i<16){
		i++;
		if(bit+i<=8){
			if(typeof huffTable.get(bits[byte].substring(bit,bit+i)) !== "undefined"){
				var dcL = bits[byte].substring(bit,bit+i);
				break;
			}		
		}else{
			if(bit+i<=16){
				if(typeof huffTable.get(bits[byte].substring(bit)+bits[byte+1].substring(0,bit+i-8)) !== "undefined"){
					var dcL =bits[byte].substring(bit)+bits[byte+1].substring(0,bit+i-8);
					break;
				}
		}else{
			if(typeof huffTable.get(bits[byte].substring(bit)+bits[byte+1]+ bits[byte+2].substring(0,bit+i-16)) !== "undefined"){
				var dcL = bits[byte].substring(bit)+bits[byte+1]+ bits[byte+2].substring(0,bit+i-16);
					break;
			}	
		}
		}
	}
	
	
	bitPointer=bitPointer+dcL.length;
	var x =huffTable.get(dcL);
	return previousValue+getDifferenceCodeR(getNextBitsR(x));
}


function getDifferenceCodeR(differenceBits){
	var number;
	if(differenceBits.length==0){
		return 0;
	}
	if (differenceBits.length==1){
		bitPointer=bitPointer+1;
		return parseInt(differenceBits)*2-1;
	}
	
	var addition = parseInt(differenceBits.substring(1),2);
	
	if (differenceBits.charAt(0)==0){
			number = (1 - Math.pow(2,differenceBits.length))+addition;
		}else{
			number = Math.pow(2,differenceBits.length-1)+addition;		
		}
	bitPointer=bitPointer+differenceBits.length;
	return number;
}


function getNextBitsR(length){
	var str="";
	for(var i =0; i<length;i++){
		str=str+bits[Math.floor((bitPointer+i)/8)].charAt((bitPointer+i)%8);	
	}
	return str;
}

function limitComponent(comp, sp){
	var maxValue =Math.pow(2,sp)-1;
	
	if(comp>maxValue){
		//comp=2*maxValue-comp;
		comp=maxValue;
	}else{
		if(comp<0){
			comp=0;
		}
	}
	return comp;
}

function decompress2V(numberOfLines,HSF,sliceDimensions,samplePrecision,ht1,ht2){
	var imageLines=[];
	for(var k =0; k <numberOfLines;k++){
		imageLines.push([]);
	}
	for(var j =0; j< sliceDimensions[0]+1;j++){
		console.log("Slice " +j);
		
		
		
		var numberOfSamples;
		var prevC1=Math.pow(2,samplePrecision-1);
		var prevC2=Math.pow(2,samplePrecision-1);
		
		if(j==sliceDimensions[0]){
			numberOfSamples= sliceDimensions[2]/HSF;
		}else{
			numberOfSamples= sliceDimensions[1]/HSF;
		}
				
		var counter = numberOfSamples*numberOfLines;
		console.log("Counter =" +counter);
		var i =0;
		while(i<counter){
			if(i>0 && i%numberOfSamples==0){
				prevC1=imageLines[Math.floor(i/numberOfSamples)-1][0];
				prevC2=imageLines[Math.floor(i/numberOfSamples)-1][1];
			}
			prevC1 = findNextValueR(ht1, prevC1);
			prevC1= limitComponent(prevC1,samplePrecision);
			
			prevC2 = findNextValueR(ht2, prevC2);
			prevC2= limitComponent(prevC2,samplePrecision);
			
			imageLines[Math.floor(i/numberOfSamples)].push(prevC1);
			imageLines[Math.floor(i/numberOfSamples)].push(prevC2);
			i+=2;
		}	
	}
	return imageLines
}

function decompress4V(numberOfLines,HSF,sliceDimensions,samplePrecision,ht1,ht2){
	var imageLines=[];
	for(var k =0; k <numberOfLines;k++){
		imageLines.push([]);
	}
	for(var j =0; j< sliceDimensions[0]+1;j++){
		console.log("Slice " +j);
		
		var numberOfSamples;
		var prevC1=Math.pow(2,samplePrecision-1);
		var prevC2=Math.pow(2,samplePrecision-1);
		var prevC3=Math.pow(2,samplePrecision-1);
		var prevC4=Math.pow(2,samplePrecision-1);
		
		if(j==sliceDimensions[0]){
			numberOfSamples= sliceDimensions[2]/HSF;
		}else{
			numberOfSamples= sliceDimensions[1]/HSF;
		}
				
		var counter = numberOfSamples*numberOfLines;
		console.log("Counter =" +counter);
		var i =0;
		while(i<counter){
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
