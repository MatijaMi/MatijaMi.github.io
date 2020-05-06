function decompressYCC(metaData,rawOffset){
	
	var hts = [];
	hts.push(metaData.get("HT1"));
	hts.push(metaData.get("HT2"));
	
	var bits ="";
	for(var i =0; i <10;i++){
		var byte = bytes[rawOffset+i].toString(2);
		if(byte.length<8){
			byte=("00000000" + byte.toString(2)).substr(-8);
		}
		bits=bits+byte;
	}
	var ycc=[];
	var prevY,prevCb,prevCr;
	var firstDC = metaData.get("SOS").get("DCAC0");
	var dcLengthHuff = bits.substring(0,8)+bits.substring(16,20);
	var dcLength = hts[firstDC].get(dcLengthHuff);
	
	var differenceCode = getDifferenceCode(bits.substr(dcLengthHuff.length+8,dcLength));
	
	
	return differenceCode;
	
}

function getDifferenceCode(differenceBits){
	
	var number = parseInt(differenceBits.substring(1),2);
	if (differenceBits.charAt(0)==0){
		number= -number;
		}
	return number;
}