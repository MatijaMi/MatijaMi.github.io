function decompressRGGB(metaData){
	
	
	var ht1 =metaData.get("HT1");
	var ht2 =metaData.get("HT2");
	var numberOfLines = metaData.get("SOF3").get("NumberOfLines");
	var samplesPerLine = metaData.get("SOF3").get("samplesPerLine");
	var HSF = metaData.get("SOF3").get("HSF");
	var sliceDimensions = metaData.get("Slices");
	var samplePrecision = metaData.get("SOF3").get("SamplePrecision");
	var imageLines=[];
	for(var i =0; i <numberOfLines;i++){
		imageLines.push([]);
	}
	window.bitPointer=0;
	var prevC1=Math.pow(2,samplePrecision-1);
	var prevC2=Math.pow(2,samplePrecision-1);
	console.log("Start");
	
	for(var j =0; j< sliceDimensions[0]+1;j++){
		console.log("Slice " +j);
		
		var res;
		var numberOfSamples;
		var sample =[];
		
		if(j==sliceDimensions[0]){
			numberOfSamples= sliceDimensions[2]/2;
		}else{
			numberOfSamples= sliceDimensions[1]/2;
		}
				
		var counter = numberOfSamples*numberOfLines;
		console.log("Counter =" +counter);
		var temp = [];
		var i =0;
		while(i<counter){
		
			sample=[];
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
			i++;
		}	
		
	}
	console.log(imageLines.length);
	console.log(imageLines[0].length);
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
	
	return previousValue+getDifferenceCode(getNextBits(x));
}


function getDifferenceCode(differenceBits){
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
			number =parseInt(differenceBits);			
		}
	bitPointer=bitPointer+differenceBits.length;
	return number;
}


function getNextBits(length){
	var str="";
	for(var i =0; i<length;i++){
		str=str+bits[Math.floor((bitPointer+i)/8)].charAt((bitPointer+i)%8);	
	}
	return str;
}

function limitComponent(comp, sp){
	var maxValue =Math.pow(2,sp)-1;
	
	if(comp>maxValue){
		comp=maxValue;
	}else{
		if(comp<0){
			comp=0;
		}
	}
	return comp;
}

