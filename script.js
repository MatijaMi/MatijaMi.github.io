var data = []; 


function fileAdded() {

    var files = document.getElementById('fileInput').files;
    
	if (!files.length) {
      alert('Please select a file!');
      return;
    }

    	var file = files[0];
		var reader = new FileReader();
		
	reader.onload = function(){
      	var arrayBuffer = reader.result;
		var bits = [];
		window.bytes = new Uint8Array(arrayBuffer);
		collectData();
    };
	
	  reader.readAsArrayBuffer(file);
  };


function collectData(){
	//Variables for working with IFDZero
	var ifd0Entries = [];
	var ifdZeroOffset = 16;
	var modelName = findIFDTagValue(ifdZeroOffset, 16,1,true,true);
	
	//Code for finding the EXIF Sub-IFD
	var exifOffset = findIFDTagValue(ifdZeroOffset,105,135,false,false);
	var makerNoteOffset = findIFDTagValue(exifOffset,124,146,false,false);
	
	
	
	ifd0Entries.push(modelName);
	ifd0Entries.push(" "+ exifOffset+" ");
	ifd0Entries.push(makerNoteOffset);
	document.getElementById("ifd0").innerHTML= '<ul>' + ifd0Entries.join('') + '</ul>';	
	
} 



function findIFDTagValue(ifdOffset,tagID1, tagID2, isOffsetToValue, isValueString){
	var ifdLength = transformTwoBytes(bytes[ifdOffset],bytes[ifdOffset+1]);
	var tag = findIFDEntries(ifdOffset, ifdLength,tagID1,tagID2);
	
	if(isOffsetToValue){
		var offsetValue = transformFourBytes.apply(null,tag.slice(8,12));
		var valueLength = transformFourBytes.apply(null,tag.slice(4,8))
		if(isValueString){
			return findNameValue(offsetValue,valueLength);
		}
	}else{
		return  transformFourBytes.apply(null,tag.slice(8,12));
	}
	
	
	
}


function findNameValue(modelOffset, modelLength){
	var model = "";
	for(var i =0; i< modelLength; i++){
		model= model +String.fromCharCode(bytes[modelOffset+i]);
	}
	
	return model;
}



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

 
function transformTwoBytes(byte1, byte2){
	return byte1 + byte2*256;
}


function transformFourBytes(byte1,byte2,byte3,byte4){
	
	return byte1+ byte2*Math.pow(2,8) + byte3*Math.pow(2,16) + byte4*Math.pow(2,24);
	
}
