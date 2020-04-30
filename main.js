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
	var ifd0Entries = [];
	var ifdZeroOffset = 16;
	var modelName = findIFDTagValue(ifdZeroOffset, 16,1,true,true);
	var makeName = findIFDTagValue(ifdZeroOffset,15,1,true,true);
	//Code for finding the EXIF Sub-IFD
	var exifOffset = findIFDTagValue(ifdZeroOffset,105,135,false,false);
	var makerNoteOffset = findIFDTagValue(exifOffset,124,146,false,false);
	var date = findIFDTagValue(ifdZeroOffset,50,1,true,true);
	//Code for getting some of the Exif tags
	var exposureTime=findIFDTagValue(exifOffset,154,130,false,false);
	var fNumber = findIFDTagValue(exifOffset,157,130,false,false);
	//var imageType = findIFDTagValue(makerNoteOffset,6,0,true,true);
	//TODO IMPLEMENT METHODS FOR MAKERNOTE VALUES
	
	var cameraSettingsOffset = findIFDTagValue(makerNoteOffset,1,0,false,false);
	var cameraSettings = saveCameraSettings(cameraSettingsOffset);
	
	
	
	
	//var sensorInfo = findIFDTagValue(makerNoteOffset,224,0,true,false); Format: N of entries then use offset
	
	ifd0Entries.push(makeName);
	ifd0Entries.push(modelName);
	//ifd0Entries.push(exifOffset);
	//ifd0Entries.push(makerNoteOffset);
	ifd0Entries.push(date);
	//ifd0Entries.push(exposureTime);
	//ifd0Entries.push(fNumber);
	ifd0Entries.push(imageType);
	ifd0Entries.push(sensorInfo);
	//ifd0Entries.push(getAllEntries(ifdZeroOffset));
	//ifd0Entries.push(getAllEntries(exifOffset));
	//ifd0Entries.push(getAllEntries(makerNoteOffset));
	//ifd0Entries.push(getValueFromOffset(sensorInfo,34));
	document.getElementById("ifd0").innerHTML= '<ul>' + ifd0Entries.join('<p>') + '</ul>';	
	
} 




