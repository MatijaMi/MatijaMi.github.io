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


function getValueFromOffset(offset, length){
	
	var val = [];
	for(var i =0; i<length; i++){
		val.push('<li>');
		val.push(bytes[offset+i]);
		val.push('</li>');
	}
	return val;
}