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
 
function findIFDZeroLegth(){

	var firstbyte = bytes[16];
	var secondbyte = bytes[17]*256;
	//console.log(firstbyte);
	//console.log(secondbyte);
	return firstbyte+secondbyte;
}

function collectData(){
	
	var ifd0Entries = [];
	var ifdLength = findIFDZeroLegth();
	
	var model = findIFDEntries(ifdLength,18, 16, 1);
	var modelOffset =transformFourBytes.apply(null,model.slice(8,12));
	var modelLength = transformFourBytes.apply(null, model.slice(4,8))
	var modelName =findModelName(modelOffset, modelLength);
	ifd0Entries.push(modelName);
	
	var exif = findIFDEntries(ifdLength, 105, 135);
	
	
	
	
	document.getElementById("ifd0").innerHTML= '<ul>' + ifd0Entries.join('') + '</ul>';	
}


function transformFourBytes(byte1, byte2,byte3,byte4){
	
	return byte1+ byte2*Math.pow(2,8) + byte3*Math.pow(2,16) + byte4*Math.pow(2,24);
	
}

function findModelName(modelOffset, modelLength){
	var model = "";
	for(var i =0; i< modelLength; i++){
		model= model +String.fromCharCode(bytes[modelOffset+i]);
	}
	
	return model;
}



function findIFDEntries(ifdLength, ifdOffset, ID1, ID2){
	
	var ifdEntry = [];
	for(var i =0; i <ifdLength; i++){
		var tagID1 = bytes[ifdOffset+12*i];
		var tagID2 = bytes[ifdOffset+1+12*i]; 
			
		if(tagID1==ID1 && tagID2==ID2){
			for(var j =0; j <12; j++){
				ifdEntry.push(bytes[18+j+12*i]);
			}
		}	
	}
	return ifdEntry;
}