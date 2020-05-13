function decompressYCC(metaData){
	
	
	var ht1 =metaData.get("HT1");
	var ht2 =metaData.get("HT2");
	var numberOfLines = metaData.get("SOF3").get("NumberOfLines");
	var samplesPerLine = metaData.get("SOF3").get("samplesPerLine");
	var HSF = metaData.get("SOF3").get("HSF");
	var sliceDimensions = metaData.get("Slices");
	var samplePrecision = metaData.get("SOF3").get("SamplePrecision");
	var imageLines=[];
	for(var k =0; k <numberOfLines;k++){
		imageLines.push([]);
	}
	
	window.bitPointer=0;
	
	
	
	for(var j =0; j< sliceDimensions[0]+1;j++){
		var numberOfSamples;
		var sample =[];
		var slice =[];
		var prevY=Math.pow(2,samplePrecision-1);
		var prevCb=0;
		var prevCr=0;
		
		if(j==sliceDimensions[0]){
			numberOfSamples= sliceDimensions[2]/HSF;
		}else{
			numberOfSamples= sliceDimensions[1]/HSF;
		}
		
		var counter = numberOfSamples*numberOfLines;
		var Y,Cb,Cr;
		var i =0;
		while(i<counter){
			
			
			
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


function findNextValue(huffTable, previousValue,c){
	
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


function applyDiffs(image){
	var prevY=Math.pow(2,14);
	var prevCr=0;
	var prevCb=0;
	
	for(var i =0;i<image.length;i++){
		for(var j =0; j<image[i].length;j+=2){
			image[i][j][0]=limitY(prevY+image[i][j][0],15);
			image[i][j][1]= limitC(prevCb+image[i][j][1],15);
			image[i][j][2]= limitC(prevCr+image[i][j][2],15);
			image[i][j+1][0]= limitY(image[i][j][0]+image[i][j+1][0],15);
			
			prevY=image[i][j+1][0];
			prevCb=image[i][j][1];
			prevCr=image[i][j][2];
			
		}
		
	}
	
	return image;
	
}



function getNextBits(length){
	var str="";
	for(var i =0; i<length;i++){
		str=str+bits[Math.floor((bitPointer+i)/8)].charAt((bitPointer+i)%8);	
	}
	return str;
}

function interpolateYCC(image){
	
	for(var i = 0; i <image.length;i++){
		for(var j =1; j<image[i].length;j++){
			var prevCb = image[i][j-1][1];
			var prevCr = image[i][j-1][2];
			if(j==(image[i].length-1)){
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
			
			var r =Y +Cr;
			var g =Y - 0.19*Cb - 0.5*Cr;
			var b =Y +Cb;
			image[i][j][0]=r;
			image[i][j][1]=g;
			image[i][j][2]=b;
		}
	}
	return image;
}

function limitY(y, sp){
	var maxy= Math.pow(2,sp)-1;
	if(y>maxy){
		y=y-maxy;
	}else{
		if(y<0){
			y=maxy+y;
		}
	}
	
	return y;
}

function limitC(c,sp){
	var maxC= Math.pow(2,sp-1)-1;
	var minC=0-maxC;
	if(c>maxC){
		c=minC+(c-maxC);
	}else{
		if(c<minC){
			c=maxC+(c - minC);
		}
	}
	
	
	return c;
}












