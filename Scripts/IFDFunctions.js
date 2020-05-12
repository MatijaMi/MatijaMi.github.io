//Function to find an entry in an IFD if the IDF's offet and length are given
//as well as the tag in a two byte format
function findIFDEntry(ifdOffset, ifdLength, ID1, ID2){
	
	var ifdEntry = [];
	
	for(var i =0; i <ifdLength; i++){
		var tagID1 = bytes[ifdOffset+2+12*i];
		var tagID2 = bytes[ifdOffset+3+12*i]; 
			
		if(tagID1==ID1 && tagID2==ID2){
			//If the tag is found, the tag plus 10 bytes is the entry
			for(var j =0; j <12; j++){
				ifdEntry.push(bytes[ifdOffset+2+j+12*i]);
			}
		}	
	}
	
	return ifdEntry;
}
//Function to find the value of an IFD tag if the value in the 12 bytes is an offset
function findValue(valueOffset, valueLength, isValueString){
	//If the value is a string it just concatinates all the the chars
	if(isValueString){
	var value = "";
	
	for(var i =0; i< valueLength; i++){
		value= value + String.fromCharCode(bytes[valueOffset+i]);
	}
		
	}else{
		//If the value is multiple values, they get saved into an array
		var value = [];
		for(var i =0; i< valueLength; i++){
		value.push(transformTwoBytes(bytes[valueOffset+i*2],bytes[valueOffset+1+i*2]));
	}	
	}
	return value;
}

//Finds the value of an IFD given its tag and offset to the IFD, and what the value simbolizes
function findIFDTagValue(ifdOffset,tagID1, tagID2, isOffsetToValue, isValueString){
	var ifdLength = transformTwoBytes(bytes[ifdOffset],bytes[ifdOffset+1]);
	var tag = findIFDEntry(ifdOffset, ifdLength,tagID1,tagID2);
	
	if(isOffsetToValue){
		//IFDEntryFormat /2 Bytes Tag - 2 Bytes Type - 4 Bytes Length - 4 Bytes Value;
		var offsetValue = transformFourBytes.apply(null,tag.slice(8,12));
		var valueLength = transformFourBytes.apply(null,tag.slice(4,8))
		return findValue(offsetValue,valueLength, isValueString);
		
	}else{
		return  transformFourBytes.apply(null,tag.slice(8,12));
	}
}