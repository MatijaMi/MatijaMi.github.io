//Takes two bytes a and b and returns the value the binary string b-a would have
//Fix for endianess
function transformTwoBytes(byte1, byte2){
	//Effectively a bit shift and addition
	return byte1 + byte2*256;
}

//Similar to previous function but with 4 bytes
 function transformFourBytes(byte1,byte2,byte3,byte4){
	 //Effectively some bit shifts and additions
	return byte1+ byte2*Math.pow(2,8) + byte3*Math.pow(2,16) + byte4*Math.pow(2,24);
}

//Function to correct the length of Huffman Code length
function numberToBitString(number, bitCount){
	return ("00000000" +number.toString(2)).substr(-bitCount);
}


function byteToString(byte){
	return ("0000000" + byte.toString(2)).substr(-8)	
}
function getBits(data){
	window.bits =[];
	for(var i =0; i <data.length;i++){
		var byte = byteToString(data[i]);
		bits.push(byte);
		if(data[i]==255){
			i++;
		}
		if(i%(Math.floor(data.length/100))==0){
			postMessage(["PB",i/(Math.floor(data.length/100)),"Transforming Bytes"]);
		}
	}
	postMessage(["PB",100,"Transforming Bytes"]);	   
}