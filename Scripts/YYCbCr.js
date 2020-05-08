function decompressYCC(metaData){
	
	
	var ht1 =metaData.get("HT1");
	var ht2 =metaData.get("HT2");
	var numberOfLines = metaData.get("SOF3").get("NumberOfLines");
	var samplesPerLine = metaData.get("SOF3").get("samplesPerLine");
	var HSF = metaData.get("SOF3").get("HSF");
	var sliceDimensions = metaData.get("Slices");
	var samplePrecision = metaData.get("SOF3").get("SamplePrecision");
	var imageSlices = [];
	window.bitPointer=0;
	
	for(var j =0; j< sliceDimensions[0]+1;j++){
	//for(var j =0; j< 1;j++){
		var slice=[];
		var res;
		var numberOfSamples;
		var sample =[];	
		var prevY=Math.pow(2,samplePrecision-1);
		var prevCb=0;
		var prevCr=0;
		
		
		
		if(j==sliceDimensions[0]){
			numberOfSamples= sliceDimensions[2]/HSF;
			console.log("NOS="+ numberOfSamples);
		}else{
			numberOfSamples= sliceDimensions[1]/HSF;
			console.log("NOS="+ numberOfSamples);
		}
		
		var counter = numberOfSamples*numberOfLines;
		console.log(counter);
		var i =0;
		while(i<counter){
			sample=[];
			prevY = findNextValue(ht1, prevY);
			sample.push(prevY);
		
			prevY = findNextValue(ht1, prevY);
						
			prevCb = findNextValue(ht2, prevCb);
			sample.push(prevCb);
			
			prevCr = findNextValue(ht2, prevCr);
			sample.push(prevCr);
			
			slice.push(sample);
			i++;
			sample = [];
			sample.push(prevY);
			slice.push(sample);
			i++;
		}	
		imageSlices.push(slice);
	}
	
	return imageSlices;
	
}

function findNextValue(huffTable, previousValue){
	
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
	return previousValue+getDifferenceCode(getNextBits(huffTable.get(dcL)));;
}





function getDifferenceCode(differenceBits){
	var number;
	
	if(differenceBits.length==0){
		return 0;
	}
	if (differenceBits.length==1){
		return parseInt(differenceBits)*2-1;
	}
	
	var addition = parseInt(differenceBits.substring(1),2);
	
	if (differenceBits.charAt(0)==0){
			number =0 - Math.pow(2,differenceBits.length)+1+addition;
		}else{
			number = Math.pow(2,differenceBits.length-1)+addition;			
		}
	bitPointer=bitPointer+differenceBits.length;
	return number;
}


function getNextBits(length){
	var str="";
	for(var i =0; i<length;i++){
		str=str+bits[Math.floor((bitPointer+i)/8)].charAt((bitPointer+1)%8);	
	}
	return str;
}
