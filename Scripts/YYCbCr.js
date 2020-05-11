function decompressYCC(metaData){
	
	
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
	var prevY=Math.pow(2,samplePrecision-1);
	var maxY=Math.pow(2,15)-1;
	var maxC= Math.pow(2,14)-1;
	var minC= -maxC;
	for(var j =0; j< sliceDimensions[0]+1;j++){
	//for(var j =0; j< 1;j++){
		var res;
		var numberOfSamples;
		var sample =[];
		var prevCb=16384;
		var prevCr=16384;
		
		
		if(j==sliceDimensions[0]){
			numberOfSamples= sliceDimensions[2]/HSF;
		}else{
			numberOfSamples= sliceDimensions[1]/HSF;
		}
		
		var counter = numberOfSamples*numberOfLines;
		
		var i =0;
		while(i<counter){
			sample=[];
			prevY = findNextValue(ht1, prevY)%maxY;
			
			
			
			sample.push(prevY);
		
			prevY = findNextValue(ht1, prevY)%maxY;
			if(prevY>maxY){
				prevY=prevY%maxY;
			}else{if(prevY<0){
				prevY=maxY+prevY;
				}
			}
			
			prevCb = findNextValue(ht2, prevCb)%maxC;
			if(prevCb>maxC){
				prevCb=minC+(prevCb-maxC)-1;
			}else{
				if(prevCb<minC){
					prevCb=maxC+(prevCb-minC)+1;
				}
			}
			sample.push(prevCb);
			
			prevCr = findNextValue(ht2, prevCr)%maxC;
			if(prevCr>maxC){
				prevCr=minC+(prevCr-maxC)-1;
			}else{
				if(prevCr<minC){
					prevCr=maxC+(prevCr-minC)+1;
				}
			}
			sample.push(prevCr);
			
			imageLines[Math.floor(i/numberOfSamples)].push(sample);
			i++;
			sample = [];
			sample.push(prevY);
			imageLines[Math.floor(i/numberOfSamples)].push(sample);
			i++;
		}	
	
	}

	return imageLines;
	
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
		str=str+bits[Math.floor((bitPointer+i)/8)].charAt((bitPointer+1)%8);	
	}
	return str;
}

function interpolateYCC(image){
	
	for(var i = 0; i <image.length;i++){
		for(var j =1; j<image[i].length;j++){
			var prevCb = image[i][j-1][1];
			var prevCr = image[i][j-1][2];
			if(j==image[i].length-1){
				image[i][j].push(prevCb);
				image[i][j].push(nextCb);
			
			}else{
				
				var nextCb= image[i][j+1][1];
				var nextCr=	image[i][j+1][2];
				image[i][j].push(Math.floor((prevCb+nextCb)/2));
				image[i][j].push(Math.floor((prevCr+nextCr)/2));
			}
			j++;
		}
		
		
	}
	return image;	
}

function YCCtoRGB(image){
	for(var i = 0; i <image.length;i++){
		for(var j =0; j<image[i].length;j++){
			var Y=image[i][j][0];
			var Cb=image[i][j][1];
			var Cr=image[i][j][2];
			var r = Cr + Y;
			var g = Y - 0.19*Cb - 0.5*Cr
			var b =Cb + Y;
			image[i][j][0]=r;
			image[i][j][1]=g;
			image[i][j][2]=b;
		}
	}
	return image;
}














