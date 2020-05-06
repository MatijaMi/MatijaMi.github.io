//Functions purely for debugging and testing while working on the project
//will probably be removed or altered after it is done


function getAllEntries(ifdOffset){
	var ifdLength = transformTwoBytes(bytes[ifdOffset],bytes[ifdOffset+1]);
	var entries = [];
	for(var i =0; i <ifdLength; i++){
		entries.push('<li>');
			for(var j =0; j <12; j++){
				entries.push(bytes[ifdOffset+2+j+12*i]);
			}
		entries.push('</li>');
	}
	return entries;
}


function getValueFromOffsetList(offset, length){
	
	var val = [];
	for(var i =0; i<length; i++){
		val.push('<li>');
		val.push(bytes[offset+i]);
		val.push('</li>');
	}
	return val;
}


function printBytesFromOffset(offset, length){
	
	var val = [];
	for(var i =0; i<length; i++){
		
		val.push(bytes[offset+i]);
	}
	return val;
}

function printDHT(rawOffset){
	var output =[];
	var length = bytes[rawOffset+4]*256 + bytes[rawOffset+5];
	//output.push(length);
	var huffTable1 =[];
	var huffTable2 = [];
	for(var i =0; i <(length-2)/2; i++){
		
		huffTable1.push(bytes[rawOffset+6+i]);	
		huffTable2.push(bytes[rawOffset+6+(length-2)/2+i]);
	}
	
	return huffTable1 + " " + huffTable2;
}


function printRawLength(offset){
	var output = [];
	var c = 0;
	var i = 1;
	var byte1 = bytes[offset];
	var byte2 = bytes[offset+1];
	console.log(byte1);
	console.log(byte2);
	while(!(byte1 == 255 & byte2 == 217)){
		
		c=c+1;
		byte1 = bytes[offset+i];
		byte2 = bytes[offset+i+1];
		i=i+1;
	}
	return c;
	
}

