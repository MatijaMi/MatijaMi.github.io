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
	
	var ifdLength = findIFDZeroLegth();
	var ifd0Entries = [];
	ifd0Entries.push(findIFDZeroEntries(ifdLength, 16, 1));
	ifd0Entries.push(findIFDZeroEntries(ifdLength, 15, 1));
	ifd0Entries.push(findIFDZeroEntries(ifdLength, 105, 135));
	
	
	
	document.getElementById("ifd0").innerHTML= '<ul>' + ifd0Entries.join('') + '</ul>';	
}


function findIFDZeroEntries(ifdLength, ID1, ID2){
	
	var ifdEntry = [];
	for(var i =0; i <ifdLength; i++){
		var tagID1 = bytes[18+12*i];
		var tagID2 = bytes[19+12*i]; 
			
		if(tagID1==ID1 && tagID2==ID2){
			for(var j =0; j <12; j++){
				ifdEntry.push(bytes[18+j+12*i]);
			}
		}	
	}
	return ifdEntry;
}