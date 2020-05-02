var data = []; 

function startScan() {

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
		collectMetaData();
    };
	
	  reader.readAsArrayBuffer(file);
  };


function collectMetaData(){
	//Variables for working with IFDZero
	var ifdEntries = [];
	var output=[];
	var ifdZeroOffset = 16;
	
	var modelName = findIFDTagValue(ifdZeroOffset, 16,1,true,true);
	var makeName = findIFDTagValue(ifdZeroOffset,15,1,true,true);
	//Code for finding the EXIF Sub-IFD
	var exifOffset = findIFDTagValue(ifdZeroOffset,105,135,false,false);
	var makerNoteOffset = findIFDTagValue(exifOffset,124,146,false,false);
	var makerNoteLength = transformTwoBytes(bytes[makerNoteOffset],bytes[makerNoteOffset+1]);
	
	//TODO IMPLEMENT METHODS FOR MAKERNOTE VALUES
	//MakerNotes code
	var imageType = findIFDTagValue(makerNoteOffset,16,0,false,false);
	
	//IFD3 Code
	
	var ifdThreeOffset = transformFourBytes.apply(null,bytes.slice(12,16));
	var ifdThreeLength = transformTwoBytes(bytes[ifdThreeOffset],bytes[ifdThreeOffset+1]);
	var rawOffset = findIFDTagValue(ifdThreeOffset,17,1,false,false);
	var rawLength = findIFDTagValue(ifdThreeOffset,23,1,false,false);
	//TO BE SEEN
	//var colorBalanceOffset = findIFDTagValue(makerNoteOffset,1,64,false,false);
	
	var slices = findIFDTagValue(ifdThreeOffset,64,198,true,false);
	var width = slices[0]*slices[1]+slices[2];
	
	
	
	
	ifdEntries.push(makeName);
	ifdEntries.push(modelName);
	ifdEntries.push(imageType);
	ifdEntries.push(ifdThreeOffset);
	ifdEntries.push(rawLength);
	ifdEntries.push(slices);
	
	
	output.push(makeName);
	output.push(modelName);
	output.push(imageType);
	output.push(ifdThreeOffset);
	output.push(rawLength);
	output.push(makerNoteOffset);
	output.push(makerNoteLength);
	//output.push(colorBalanceOffset);
	//output.push(getValueFromOffset(colorBalanceOffset,3000));
	output.push(slices);
	output.push(printDHT(rawOffset));
	
	
	document.getElementById("ifd0").innerHTML= '<ul>' + output.join('<p>') + '</ul>';	
	
} 




