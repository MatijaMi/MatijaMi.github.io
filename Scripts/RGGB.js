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
	//for(var j =0; j< 1;j++){
		
		var res;
		var numberOfSamples;
		var sample =[];
		
		if(j==sliceDimensions[0]){
			numberOfSamples= sliceDimensions[2]/HSF;
		}else{
			numberOfSamples= sliceDimensions[1]/HSF;
		}
		
		var counter = numberOfSamples*numberOfLines;
		console.log("Counter =" +counter);
		var temp = [];
		var i =0;
		while(i<counter){
			sample=[];
			
			prevC1 = findNextValueR(ht1, prevC1);
			prevC1= limitComponent(prevC1,samplePrecision);
			
			prevC2 = findNextValueR(ht2, prevC2);
			prevC2= limitComponent(prevC2,samplePrecision);
			
			imageLines[Math.floor(i/numberOfSamples)].push(prevC1);
			imageLines[Math.floor(i/numberOfSamples)].push(prevC2);
			i+=2;
		}	
		
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
			number = Math.pow(2,differenceBits.length-1)+addition;			
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
	var maxValue =Math.pow(2,sp);
	
	if(comp>maxValue){
		comp=maxValue;
	}else{
		if(comp<0){
			comp=0;
		}
	}
	return comp;
}


function ruffBayer(image){
	var newImg=[];
	var pixel=[];
	for(var i =0; i <image.length;i+=2){
		for(var j=0; j<image[i].length;j+=2){
			pixel=[];
			var r = image[i][j];
			var b = image[i+1][j+1];
			var g = (image[i][j+1]+image[i+1][j])/2;
			pixel.push(r);
			pixel.push(g);
			pixel.push(b);
			
			newImg.push(pixel);
			
		}
	}
	console.log("NEW" + newImg.length);
	return newImg;
}





