//Functions to gather data from the SOS part

//Get SOS Length in bytes
function getSOSLength(sosOffset){
	return bytes[sosOffset+2]*256 + bytes[sosOffset+3];
}

//Function to collect SOS data
function getSOSData(sosOffset){
	//Data is in constant positions relative to offset
	let sosData = new Map();
	let length = getSOSLength(sosOffset);
	const numberOfComponents = bytes[sosOffset+4];
	
	for(let i =0; i< numberOfComponents; i++){
		//Setting which Huffman Tables will be used later
		if(bytes[sosOffset+6+2*i]==0){
			sosData.set("DCAC" +i, 0);
		}else{
			sosData.set("DCAC" +i, 1);
		}	
	}
	return sosData;
}