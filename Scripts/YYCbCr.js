function decompressYCC(metaData){
	
	var hts = [];
	hts.push(metaData.get("HT1"));
	hts.push(metaData.get("HT2"));
	var numberOfLines = metaData.get("SOF3").get("NumberOfLines");
	var samplesPerLine = metaData.get("SOF3").get("samplesPerLine");
	var HSF = metaData.get("SOF3").get("HSF");
	var sliceDimensions = metaData.get("Slices");
	var samplePrecision = metaData.get("SOF3").get("SamplePrecision");
	
	
	var bits =[];
	
	bits.push("");
	
	
	for(var i =0; i <10;i++){
		var byte = bytes[i].toString(2);
		if(byte.length<8){
			byte=("00000000" + byte.toString(2)).substr(-8);
		}
		bits[0]=bits[0]+byte;
	}
	bits.push(10);
	
	
	
	var imageSlices = new Map();
	//for(var j =0; j< sliceDimensions[0]+1;j++){
	for(var j =0; j< 1;j++){
		var slice=[];
		var numberOfSamples;
		if(j==sliceDimensions[0]+1){
			numberOfSamples= sliceDimensions[2]/HSF;
		}else{
			numberOfSamples= sliceDimensions[1]/HSF;
		}
			var prevY,prevCb,prevCr;
		//for(var i =0; i <numberOfSamples*numberOfLines;i++){
		for(var i =0; i <1;i++){
			var sample =[];
			if(i==0 && j==0){
				var firstDC = metaData.get("SOS").get("DCAC0");
				var dcLengthHuff = bits[0].substring(0,8)+bits[0].substring(16,20);
				var dcLength = hts[firstDC].get(dcLengthHuff);
				var differenceCode = getDifferenceCode(bits[0].substr(dcLengthHuff.length+8,dcLength));
				var y = Math.pow(2,samplePrecision-1) + differenceCode;
				sample.push(y);
				prevY=y;
				console.log(prevY);
				bits = adjustBits(bits,(dcLengthHuff+"00000000").length+dcLength);
				console.log(bits);
			}else{
						
				
			}	
			var res=  findNextValue(bits, hts[metaData.get("SOS").get("DCAC0")], prevY);
				y= res[0];
				bits=res[1];
			res=  findNextValue(bits, hts[metaData.get("SOS").get("DCAC1")], prevY);
			sample.push(res[0]);
			bits=res[1];
			res=  findNextValue(bits, hts[metaData.get("SOS").get("DCAC1")], prevY);
			sample.push(res[0]);
			bits=res[1];
			slice.push(sample);
			sample=[];
			sample.push(y);
			slice.push(sample);
		}	
	}
	
	
	return slice;
	
}

function findNextValue(bits, huffTable, previousValue){
	var output=[];
	var found =false;
	var i =0;
	while(found==false){
		i++;
		console.log("CURRENT I:"+i);
		if(typeof huffTable.get(bits[0].substring(0,i)) !== "undefined"){
			console.log("SUCCES" + i);
			found=true;
		}
	}
	
	var dcLength =huffTable.get(bits[0].substring(0,i));
	console.log("LENGTH OF CODE: "+dcLength);
	var differenceValue= getDifferenceCode(bits[0].substring(i,dcLength+i));
	 console.log("PREV:"+previousValue);
	console.log("DIFFV:"+differenceValue);
	output.push(previousValue+differenceValue);
	bits=adjustBits(bits,i+dcLength);
	output.push(bits);
	return output;
}





function getDifferenceCode(differenceBits){
	var number;
	
	if(differenceBits.length==0){
		return 0;
	}
	
	var addition = parseInt(differenceBits.substring(1),2);
	
	if (differenceBits.charAt(0)==0){
			number = -Math.pow(2,differenceBits.length)+1+addition;
		}else{
			number = Math.pow(2,differenceBits.length-1)+addition;			
		}
	return number;
}
	
	
	
 function adjustBits(bits, usedBits){
	 var usedBytes;
	 if(usedBits%8==0){
		 usedBytes=totalBits/8;
	 }else{
		 usedBytes= Math.floor(usedBits/8)+1;
	 }
	 bits[0]=bits[0].substring(usedBits);
	 var byteCount=bits[1];
	 for(var i =0; i <usedBytes;i++){
		 bits[0]=bits[0]+byteToString(bytes[byteCount+i]); 
	 }
	 bits[1]=bits[1]+usedBytes;
	 return bits;
 }