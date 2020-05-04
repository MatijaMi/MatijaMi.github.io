var data = []; 

//Function that gets called when the file is submitted
function startScan() {

    var files = document.getElementById('fileInput').files;
    
	if (!files.length) {
      alert('Please select a file!');
      return;
    }
	
    	var file = files[0];
		var reader = new FileReader();
		//Once the .cr2 file has been read it gets saved as a byte array(==Uint8Array)
	reader.onload = function(){
      	var arrayBuffer = reader.result;
		var bits = [];
		window.bytes = new Uint8Array(arrayBuffer);
		//the metaData that might need to be collected
		collectMetaData();
    };
	
	  reader.readAsArrayBuffer(file);
  };

//Function to collect data from IFD#0,IFD#3, EXIF and MakerNote-SubIFD
function collectMetaData(){
	//Variables for working with IFDZero
	var metaData = new Map();
	var output=[];
	//The offset to IFD#0 is always 16
	const ifdZeroOffset = 16;
	
	const modelName = findIFDTagValue(ifdZeroOffset, 16,1,true,true);
	const makerName = findIFDTagValue(ifdZeroOffset,15,1,true,true);
	//Code for finding the EXIF Sub-IFD
	const exifOffset = findIFDTagValue(ifdZeroOffset,105,135,false,false);
	const makerNoteOffset = findIFDTagValue(exifOffset,124,146,false,false);
	const makerNoteLength = transformTwoBytes(bytes[makerNoteOffset],bytes[makerNoteOffset+1]);
	
	//TODO IMPLEMENT METHODS FOR MAKERNOTE VALUES(TO BE SEEN)
	//MakerNotes code
	const imageType = findIFDTagValue(makerNoteOffset,16,0,false,false);
	//IFD3 Code
	const ifdThreeOffset = transformFourBytes.apply(null,bytes.slice(12,16));
	const ifdThreeLength = transformTwoBytes(bytes[ifdThreeOffset],bytes[ifdThreeOffset+1]);
	const rawOffset = findIFDTagValue(ifdThreeOffset,17,1,false,false);
	const rawLength = findIFDTagValue(ifdThreeOffset,23,1,false,false);
	//TO BE SEEN
	//var colorBalanceOffset = findIFDTagValue(makerNoteOffset,1,64,false,false);
	
	var slices = findIFDTagValue(ifdThreeOffset,64,198,true,false);
	var width = slices[0]*slices[1]+slices[2];
	
	var hts = getDecodedHTs(rawOffset, bytes[rawOffset+4]*256 + bytes[rawOffset+5]);
	var sof3Offset = rawOffset+getDHTLength(rawOffset) +4;
	
	metaData.set("MakerName", makerName);
	metaData.set("modelName", modelName);
	metaData.set("ImageType", imageType);
	metaData.set("IFD3Offset", ifdThreeOffset);
	metaData.set("RawLength", rawLength);
	metaData.set("Slices", slices);
	metaData.set("HT1", hts[0]);
	metaData.set("HT2", hts[1]);
	
	for(let[key, value] of metaData){
		output.push(key+ ":"+value);
	}
	
	//OUTPUT for testing and debugging 
	//output.push(makerNoteOffset);
	//output.push(makerNoteLength);
	//output.push(colorBalanceOffset);
	//output.push(getValueFromOffset(colorBalanceOffset,3000));
	//output.push(printDHT(rawOffset));
	/*
		for( let [key,value] of ht){
			output.push(key +"---" + value)
		}
	*/
	
	
	document.getElementById("ifd0").innerHTML= '<ul>' + output.join('<p>') + '</ul>';	
	
} 




