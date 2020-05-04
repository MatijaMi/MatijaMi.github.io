function getDHTLength(rawOffset){
	return bytes[rawOffset+4]*256 + bytes[rawOffset+5];
}


function getDecodedHTs(rawOffset, length){
	
	var dhtOffset = rawOffset+6;
	var dhtLength = getDHTLength(rawOffset);
	var valueTableLength = (dhtLength-36)/2;
	var ft1Start = dhtOffset+1;
	var vt1Start= ft1Start+16;
	var ft2Start = vt1Start+valueTableLength+1;
	var vt2Start= ft2Start+16;
	
	
	
	var frequencyTable1 = bytes.slice(ft1Start,vt1Start);
	var valueTable1 = bytes.slice(vt1Start,ft2Start-1);
	
	var frequencyTable2 = bytes.slice(ft2Start,vt2Start);
	var valueTable2 = bytes.slice(vt2Start,vt2Start+valueTableLength);
	
	var huffmanTable1 = decodeHuffmanTree(frequencyTable1,valueTable1);
	var huffmanTable2 = decodeHuffmanTree(frequencyTable2,valueTable1);
	
	return huffmanTable1;
}



function decodeHuffmanTree(frequencies, values){
	
	var code =0;
	var minimumValue = [];
	
	for(var i = 0; i<frequencies.length; i++){
		if(i==0){
			minimumValue.push(0);
		}else{
		code = (code + frequencies[i-1])*2;
		minimumValue.push(code);
	}	
	}
	
	var codes = [];
	for(var i =0; i <minimumValue.length; i++){
		if(frequencies[i]>0){
			for(var j = 0; j< frequencies[i]; j++){
				codes.push(numberToBitString(j+minimumValue[i],i+1));
			}
		}
		
	}
	
	
	var huffmanTable = new Map();
	
	for( var i =0; i < values.length; i++){
		huffmanTable.set(codes[i],values[i]);
	}
	
	return huffmanTable;
}