/*	Given a position in the bit array finds the next value
	by checking if the sequence of the next bits is in the Huffman Table, 
	if it isn't it adds the next bit and checks again */
function findNextValue(huffTable, previousValue){
	
	var byte = Math.floor(bitPointer/8);
	var bit = bitPointer%8;
	
	var i =0;
	/* Seeing as  the code can be in multiple bytes, we have 
		to beware where to search, worst case we search in 3 bytes */
	var currentCode;
	while(i<16){
		i++;
				
		if(bit+i<=8){
			currentCode=bits[byte].substring(bit,bit+i);
			if(typeof huffTable.get(currentCode) !== "undefined"){
				break;
			}		
		}else{
			if(bit+i<=16){
				currentCode=bits[byte].substring(bit)+bits[byte+1].substring(0,bit+i-8);
				if(typeof huffTable.get(currentCode) !== "undefined"){
					break;
				}
			}else{
				currentCode=bits[byte].substring(bit)+bits[byte+1]+ bits[byte+2].substring(0,bit+i-16);
				if(typeof huffTable.get(currentCode) !== "undefined"){
					break;
				}	
			}
		}
	}

	bitPointer=bitPointer+i;
	var differenceCodeLength =huffTable.get(currentCode);
	//The next value is equal to the previous value + the difference value
	return previousValue+getDifferenceValue(getNextBits(differenceCodeLength));
}

/*	Given a sequence of bits, calculates their value based
	on the system used for difference values:
	-The first bit represents the sign, 1 is minus and 0 plus
	-If negative the value is equal to -1 + 2^lengthOfDifferenceCode+ bitsWithoutSign.toDecimal
	-If positive the value is equal to 2^(lengthOfDifferenceCode-1)+ bitsWithoutSign.toDecimal */
function getDifferenceValue(differenceBits){
	var number;
	if(differenceBits.length==0){//If zero then there is no difference
		return 0;
	}
	if (differenceBits.length==1){//For length one it's either -1 or 1
		bitPointer=bitPointer+1;
		return parseInt(differenceBits)*2-1;
	}
	
	var restBits = parseInt(differenceBits.substring(1),2);
	
	if (differenceBits.charAt(0)==0){//Sign
			number = (1 - Math.pow(2,differenceBits.length))+restBits;
		}else{
			number = Math.pow(2,differenceBits.length-1)+restBits;			
		}
	bitPointer=bitPointer+differenceBits.length;
	return number;
}
function getNext16Bits(bitPointer){
	var first =0;
	var second =1;
	var third =2;
	var skippedBytes=0;
	if((bytes[Math.floor(bitPointer/8)-1])==255){
		first++;
		second++;
		third++;
		skippedBytes++;
	}
	
	if((bytes[Math.floor(bitPointer/8)+first])==255){
		second++;
		third++;
		skippedBytes++;
	}
	
	if((bytes[Math.floor(bitPointer/8)+second])==255){
		third++;
		skippedBytes++;
	}
	
	var bit1= byteToString(bytes[Math.floor(bitPointer/8)+first]).substr(bitPointer%8);
	var bit2= byteToString(bytes[Math.floor(bitPointer/8)+second]);
	var bit3= byteToString(bytes[Math.floor(bitPointer/8)+third]);
	bitPointer=bitPointer+skippedBytes*8;
	return bit1+bit2+bit3;
	
}
//Returns the next n bits
function getNextBits(n){
	
	var str="";
	for(var i =0; i<n;i++){
		str=str+bits[Math.floor((bitPointer+i)/8)].charAt((bitPointer+i)%8);	
	}
	
	return str;
	//return getNext16Bits(bitPointer).substr(0,n);
}

/*	Depending on the number of components, returns an array with
	the proper Huffman Table for each component */
function setupHTS(sos,ht1,ht2,numberOfComponents){
	var hts=[];
	for(var k =0; k <numberOfComponents;k++){
		if(sos.get("DCAC"+k)==0){
			hts.push(ht1);
		}else{
			hts.push(ht2);
		}
	}
	return hts;
}
//Returns how the components and  how many of their parts are saved in the bits
function setupComponentParts(HSF,VSF){
	if(HSF==1){
		var compParts=[1,1];
	}else{
		if(VSF==1){
			var compParts=[2,1,1];
		}else{
			var compParts=[4,1,1];
		}
	}
	return compParts;
}

/*	Initialises the previous values
	R,G,B and Y : 2^(samplePrecision-1)
	Cb and Cr : 0 */
function setPreviousValues(nComponents,samplePrecision){
	var previousValues = [];
	for(var k =0; k<nComponents;k++){
		if(nComponents!=3 || k==0){
			previousValues[k]=Math.pow(2,samplePrecision-1);
		}else{
			previousValues[k]=0;
		}
	}
	return previousValues;
}

/*	Returns the number of entries in one sequence of 
	values before repeating(RGGB=2 or 4;YCC=4;YYYYCC=6) */
function getNumberOfEntries(HSF,VSF){
	if(HSF==1){
		return nComponents;
	}else{
		if(VSF==1){
			return 4;
		}else{
			return 6;
		}
	}
}

/* 	Due to the borders of the camera's sensors not always
	being exactly on the edge of the image, removes black stripes
	 on the edges where there were no sensors from the image */
function cropBorders(image, top, left, bot, right){
	var croppedImage =[];
	for(var i=top;i<bot;i++){
		croppedImage.push(image[i].slice(left,right));
	}
	return croppedImage;
}

/*	Based on the White Balance values from the MakerNote,
	calculates the ratios between the colors by using the biggest element
	to decrease file size */
function applyWhiteBalance(image,metaData){
	var wb = metaData.get("WhiteBalance");
	var max=wb[0];
	for(var k = 1; k<4;k++){
		if(wb[k]>max){
			max=wb[k];
		}
	}
	var wbarr=[];
	wbarr.push(Number((wb[0]/max).toFixed(2)));
	wbarr.push(Number((wb[1]/max).toFixed(2)));
	wbarr.push(Number((wb[3]/max).toFixed(2)));
	
	for( var i=0; i <image.length;i++){
		if(i%(Math.floor(image.length/100))==0){
			postMessage(["PB",i/(Math.floor(image.length/100)),"Applying White Balance"]);
		}
		for(var j =0; j<image[i].length;j+=3){
			image[i][j]=Number((image[i][j]*wbarr[0]).toFixed(2));
			image[i][j+1]=Number((image[i][j+1]*wbarr[1]).toFixed(2));
			image[i][j+2]=Number((image[i][j+2]*wbarr[2]).toFixed(2));
		}
	}
	return image;
}
