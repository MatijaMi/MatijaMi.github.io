function findNextValue(huffTable, previousValue){
	
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
	
	
	bitPointer=bitPointer+i;
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

function setupComponentParts(HSF,VSF){
	if(HSF==1){
		var compParts=[1,1,1,1];
	}else{
		if(VSF==1){
			var compParts=[2,1,1];
		}else{
			var compParts=[4,1,1];
		}
	}
	return compParts;
}

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

function getNumberOfEntries(nComponents,HSF,VSF){
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


function cropBorders(image, top, left, bot, right){
	var croppedImage =[];
	for(var i=top;i<bot;i++){
		croppedImage.push(image[i].slice(left,right));
	}
	return croppedImage;
}

function applyGammaCorrection(image){
	for(var i =0; i <image.length;i++){
		for(var j=0; j<image[i].length;j++){
			var x = image[i][j]/64;
			if(x<0.00304 ){
				image[i][j]= Number((x*12.92).toFixed(3));
			}else{
				image[i][j]= Number((1.055* Math.pow(x,(1.0/2.4))-0.055).toFixed(3));
			}
		}	
	}
	return image;
}

function applyWhiteBalance(image,metaData){
	var wb = metaData.get("WhiteBalance");
	var min=wb[0];
	for(var k = 1; k<4;k++){
		if(wb[k]<min){
			min=wb[k];
		}
	}
	var wbarr=[];
	wbarr.push(Number((wb[0]/min).toFixed(2)));
	wbarr.push(Number((wb[1]/min).toFixed(2)));
	wbarr.push(Number((wb[3]/min).toFixed(2)));
	
	for( var i=0; i <image.length;i++){
		for(var j =0; j<image[i].length;j+=3){
			image[i][j]=image[i][j]*wbarr[0];
			image[i][j+1]=image[i][j+1]*wbarr[1];
			image[i][j+2]=image[i][j+2]*wbarr[2];
		}
	}
	return image;
}
