//Gets the length of the DHT from the raw offset
//Format: rawoffset: SOI Marker(2 Bytes) and DHT Marker(2 Bytes) then length (2 Bytes)
function getDHTLength(rawOffset){
	return bytes[rawOffset+4]*256 + bytes[rawOffset+5];
}


function getDecodedHTs(rawOffset, length){
	
	//Actual data needed comes 6 Bytes after the raw offset
	var dhtOffset = rawOffset+6;
	var dhtLength = getDHTLength(rawOffset);
	//Variable to determine where the frequencies and values of the huffman table start
	var valueTableLength = (dhtLength-36)/2;
	var ft1Start = dhtOffset+1;
	var vt1Start= ft1Start+16;
	var ft2Start = vt1Start+valueTableLength+1;
	var vt2Start= ft2Start+16;
	
	
	//First Huffman Table
	var frequencyTable1 = bytes.slice(ft1Start,vt1Start);
	var valueTable1 = bytes.slice(vt1Start,ft2Start-1);
	var huffmanTable1 = decodeHuffmanTree(frequencyTable1,valueTable1);
	
	//Second Huffman Table
	var frequencyTable2 = bytes.slice(ft2Start,vt2Start);
	var valueTable2 = bytes.slice(vt2Start,vt2Start+valueTableLength);
	var huffmanTable2 = decodeHuffmanTree(frequencyTable2,valueTable1);
	
	var output = [];
	output.push(huffmanTable1);
	output.push(huffmanTable2);
	return output;
}


//Function that decodes the huffman tree using the two tables 
function decodeHuffmanTree(frequencies, values){
	
	var code =0;
	var minimumValue = [];
	//Finding the minimum value for the huffman codes of a set length of bits
	for(var i = 0; i<frequencies.length; i++){
		if(i==0){
			minimumValue.push(0);
		}else{
		code = (code + frequencies[i-1])*2;
		minimumValue.push(code);
	}	
	}
	//Creates an array with all the codes that are used based on the minimum values
	var codes = [];
	for(var i =0; i <minimumValue.length; i++){
		if(frequencies[i]>0){
			for(var j = 0; j< frequencies[i]; j++){
				codes.push(numberToBitString(j+minimumValue[i],i+1));
			}
		}
		
	}
	
	var huffmanTable = new Map();
	//Mapping the values to the corresponding codes
	for( var i =0; i < values.length; i++){
		huffmanTable.set(codes[i],values[i]);
	}
	
	return huffmanTable;
}