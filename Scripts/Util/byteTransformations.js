//Takes two bytes a and b and returns the value the binary string b-a would have
//Fix for endianess
function transformTwoBytes(byte1, byte2){
	//Effectively a bit shift and addition
	return byte1 + (byte2<<8);
}

//Similar to previous function but with 4 bytes
 function transformFourBytes(byte1,byte2,byte3,byte4){
	 //Effectively some bit shifts and additions
	return byte1 + (byte2<<8) + (byte3<<16) + (byte4<<24);
}

//Function to correct the length of Huffman Code in order to get a valid code
function numberToBitString(number, bitCount){
	return ("00000000" +number.toString(2)).substr(-bitCount);
}

/*	Transforming all of the bytes into an array of bytes represented in bits
	for easier decoding, changes to this function are possible, maybe even completely deleting it
	if a better solution is found */
function transformBytesToBits(data){
	let bits =[];
	for(let i =0; i <data.length;i++){
		bits.push(decToBin(data[i]));
		if(data[i]==255){
			i++;
		}
		//Updates for the progress bar
		progressBarUpdate(i,Math.floor(data.length/100),"Transforming Bytes");
	}
	return bits;
}

/*	Function to transform a number to its binary form
 	faster than the built in toString(2) function */
function decToBin(num){
	let bin = 0;
	let k= 1;
	while(num>=1){
		bin+=(num&1)*k;
		k*=10;
		num=num>>>1;
	}
	return bin.toString();
}