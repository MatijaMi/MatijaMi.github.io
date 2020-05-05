//Functions to gather data from the SOS part


function getSOSLength(sosOffset){
	
	return bytes[sosOffset+2]*256 + bytes[sosOffset+3];
}


function getSOSData(sosOffset){
	
	var sosData = new Map();
	var length = getSOSLength(sosOffset);
	const numberOfComponents = bytes[sosOffset+4];
	
	for(var i =0; i< numberOfComponents; i++){
		
		if(bytes[sosOffset+6+2*i]==0){
			sosData.set("DCAC" +i, 0);
		}else{
			sosData.set("DCAC" +i, 1);
		}	
	}
	
	return sosData;
}