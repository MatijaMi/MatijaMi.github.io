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


function getValueFromOffset(offset, length){
	
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
		huffTable2.push(bytes[rawOffset+38+i]);
	}
	
	
	return huffTable1;
}