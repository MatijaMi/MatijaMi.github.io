//Takes two bytes a and b and returns the value the binary string b-a would have
//Fix for endianess
function transformTwoBytes(byte1, byte2){
	return byte1 + byte2*256;
}

//Similar to previous function but with 4 bytes
 function transformFourBytes(byte1,byte2,byte3,byte4){
	return byte1+ byte2*Math.pow(2,8) + byte3*Math.pow(2,16) + byte4*Math.pow(2,24);
	
}

//Function to correct the length of Huffman Code length
function numberToBitString(number, bitCount){
	
	var bitString =number.toString(2);
	
	if(bitString.length < bitCount){
		for(var i = 0; i < bitCount - bitString.length; i++){
			bitString= "0" + bitString;
		}
		
		
	}
	return bitString;
}