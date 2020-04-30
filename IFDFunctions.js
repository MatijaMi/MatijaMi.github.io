function findIFDEntries(ifdOffset, ifdLength, ID1, ID2){
	
	var ifdEntry = [];
	
	for(var i =0; i <ifdLength; i++){
		var tagID1 = bytes[ifdOffset+2+12*i];
		var tagID2 = bytes[ifdOffset+3+12*i]; 
			
		if(tagID1==ID1 && tagID2==ID2){
			for(var j =0; j <12; j++){
				ifdEntry.push(bytes[ifdOffset+2+j+12*i]);
			}
		}	
	}
	
	return ifdEntry;
}

function findValue(valueOffset, valueLength, isValueString){
	
	if(isValueString){
	var value = "";
	
	for(var i =0; i< valueLength; i++){
		value= value + String.fromCharCode(bytes[valueOffset+i]);
	}	
	}else{
		var value = [];
		for(var i =0; i< valueLength; i++){
		value.push(transformTwoBytes(bytes[valueOffset+i*2],bytes[valueOffset+1+i*2]));
	}	
	}
	return value;
}


function findIFDTagValue(ifdOffset,tagID1, tagID2, isOffsetToValue, isValueString){
	var ifdLength = transformTwoBytes(bytes[ifdOffset],bytes[ifdOffset+1]);
	var tag = findIFDEntries(ifdOffset, ifdLength,tagID1,tagID2);
	
	if(isOffsetToValue){
		var offsetValue = transformFourBytes.apply(null,tag.slice(8,12));
		var valueLength = transformFourBytes.apply(null,tag.slice(4,8))
		return findValue(offsetValue,valueLength, isValueString);
		
	}else{
		return  transformFourBytes.apply(null,tag.slice(8,12));
	}
}